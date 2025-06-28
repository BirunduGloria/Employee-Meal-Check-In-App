const API = "https://json-server-4866.onrender.com";
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("logout-btn-admin").addEventListener("click", handleLogout);
  document.getElementById("submit-checkin").addEventListener("click", handleCheckIn);
  document.getElementById("quick-admin-login").addEventListener("click", () => {
    document.getElementById("sap-input").value = "ADMIN001";
    document.getElementById("pin-input").value = "admin002";
    handleLogin();
  });
  document.getElementById("add-employee").addEventListener("click", addEmployee);
  loadEmployeeList();
});

async function handleLogin() {
  const sap = document.getElementById("sap-input").value.trim();
  const pin = document.getElementById("pin-input").value.trim();

  if (!sap || !pin) return alert("Enter SAP and PIN");

  const res = await fetch(`${API}/employees`);
  const employees = await res.json();
  const user = employees.find(e => e.sap === sap && e.pin === pin);

  if (!user) return alert("Invalid credentials");

  currentUser = user;
  const isAdmin = user.isAdmin;

  document.getElementById("login-section").style.display = "none";
  document.getElementById("employee-section").style.display = "block";
  document.getElementById("admin-badge").style.display = isAdmin ? "block" : "none";
  document.getElementById("admin-panel").style.display = isAdmin ? "block" : "none";
}

function handleLogout() {
  currentUser = null;
  document.getElementById("login-section").style.display = "block";
  document.getElementById("employee-section").style.display = "none";
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-badge").style.display = "none";
  document.getElementById("sap-input").value = "";
  document.getElementById("pin-input").value = "";
}

async function handleCheckIn() {
  if (!currentUser) return alert("Please log in.");

  const now = new Date();
  const hour = now.getHours();
  const mealTime = document.getElementById("meal-time-select").value;
  const meal = document.getElementById("meal-select").value;
  const date = now.toISOString().split("T")[0];

  if (
    (mealTime === "Lunch" && (hour < 10 || hour > 14)) ||
    (mealTime === "Dinner" && (hour < 17 || hour > 21))
  ) {
    return alert(`${mealTime} check-in is only allowed during its time window.`);
  }

  const check = await fetch(`${API}/attendance?employeeId=${currentUser.id}&date=${date}`);
  const existing = await check.json();
  if (existing.length > 0) return alert("You have already checked in today.");

  await fetch(`${API}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId: currentUser.id, date, meal, mealTime })
  });

  alert("Check-in successful!");
  handleLogout();
}

async function addEmployee() {
  const name = document.getElementById("new-name").value.trim();
  const sap = document.getElementById("new-sap").value.trim();
  const pin = document.getElementById("new-pin").value.trim();
  const isAdmin = document.getElementById("new-admin").checked;

  if (!name || !sap || !pin) return alert("Fill all fields");

  const res = await fetch(`${API}/employees`);
  const employees = await res.json();
  if (employees.find(e => e.sap === sap)) return alert("SAP already exists");

  await fetch(`${API}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, sap, pin, isAdmin })
  });

  alert("Employee added!");
  loadEmployeeList();
}

async function loadEmployeeList() {
  const res = await fetch(`${API}/employees`);
  const employees = await res.json();
  const ul = document.getElementById("employee-list");
  ul.innerHTML = "";

  employees.forEach(emp => {
    const li = document.createElement("li");
    li.textContent = `${emp.name} (${emp.sap})`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editEmployee(emp);

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => deleteEmployee(emp.id);

    li.append(editBtn, delBtn);
    ul.appendChild(li);
  });
}

async function deleteEmployee(id) {
  if (confirm("Delete this employee?")) {
    await fetch(`${API}/employees/${id}`, { method: "DELETE" });
    loadEmployeeList();
  }
}

async function editEmployee(emp) {
  const newName = prompt("New name:", emp.name);
  const newPin = prompt("New PIN:", emp.pin);
  if (!newName || !newPin) return alert("Invalid input");

  await fetch(`${API}/employees/${emp.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, pin: newPin })
  });

  loadEmployeeList();
}
