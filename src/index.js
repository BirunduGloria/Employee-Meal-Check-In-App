const API = "http://localhost:3000";
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("submit-checkin").addEventListener("click", handleCheckIn);
  document.getElementById("print-btn").addEventListener("click", () => window.print());
  document.getElementById("email-btn").addEventListener("click", emailHR);
  document.getElementById("apply-filters").addEventListener("click", renderAdminRecords);
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("filter-employee").value = "";
    document.getElementById("filter-date").value = "";
    renderAdminRecords();
  });

  renderLoggedInUsers();
});

async function handleLogin() {
  const sap = document.getElementById("sap-input").value;
  const pin = document.getElementById("pin-input").value;

  const res = await fetch(`${API}/employees`);
  const employees = await res.json();
  const user = employees.find(emp => emp.sap === sap && emp.pin === pin);

  if (!user) return alert("Invalid SAP or PIN");

  currentUser = user;
  document.getElementById("checkin-form").hidden = false;
  document.getElementById("meal-history").hidden = false;
  document.getElementById("logout-btn").hidden = false;
  document.getElementById("login-btn").hidden = true;

  if (user.sap === "SAP001") {
    document.getElementById("admin-panel").hidden = false;
    populateEmployeeFilter();
    renderAdminRecords();
  }

  const check = await fetch(`${API}/loggedInEmployees?id=${user.id}`);
  const already = await check.json();
  if (already.length === 0) {
    await fetch(`${API}/loggedInEmployees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
  }

  renderLoggedInUsers();
  renderMealHistory();
}

async function handleLogout() {
  if (!currentUser) return;
  await fetch(`${API}/loggedInEmployees/${currentUser.id}`, { method: "DELETE" });
  currentUser = null;
  document.getElementById("checkin-form").hidden = true;
  document.getElementById("meal-history").hidden = true;
  document.getElementById("admin-panel").hidden = true;
  document.getElementById("logout-btn").hidden = true;
  document.getElementById("login-btn").hidden = false;
  renderLoggedInUsers();
}

async function handleCheckIn() {
  if (!currentUser) return;

  const meal = document.getElementById("meal-select").value;
  const mealTime = document.getElementById("meal-time-select").value;
  const date = new Date().toISOString().split("T")[0];

  const res = await fetch(`${API}/attendance?employeeId=${currentUser.id}&date=${date}`);
  const existing = await res.json();
  if (existing.length > 0) return alert("You have already checked in today.");

  await fetch(`${API}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId: currentUser.id, date, meal, mealTime })
  });

  alert("Check-in submitted!");
  renderMealHistory();
  document.getElementById("checkin-form").hidden = true;
}

async function renderMealHistory() {
  const res = await fetch(`${API}/attendance?employeeId=${currentUser.id}`);
  const history = await res.json();
  const list = document.getElementById("meal-history-list");
  list.innerHTML = "";
  history.forEach(record => {
    const li = document.createElement("li");
    li.textContent = `${record.date}: ${record.meal} (${record.mealTime})`;
    list.appendChild(li);
  });
}

async function renderLoggedInUsers() {
  const res = await fetch(`${API}/loggedInEmployees`);
  const users = await res.json();
  const list = document.getElementById("logged-in-list");
  list.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.sap})`;
    list.appendChild(li);
  });
}

function emailHR() {
  const names = Array.from(document.querySelectorAll("#logged-in-list li"))
                     .map(li => li.textContent).join("\n");
  alert("Email sent to HR:\n\n" + names);
}

async function populateEmployeeFilter() {
  const res = await fetch(`${API}/employees`);
  const employees = await res.json();
  const select = document.getElementById("filter-employee");

  select.innerHTML = `<option value="">All</option>`;
  employees.forEach(emp => {
    const opt = document.createElement("option");
    opt.value = emp.id;
    opt.textContent = emp.name;
    select.appendChild(opt);
  });
}

async function renderAdminRecords() {
  const filterEmployeeId = document.getElementById("filter-employee").value;
  const filterDate = document.getElementById("filter-date").value;

  let query = `${API}/attendance?_expand=employee`;
  const conditions = [];
  if (filterEmployeeId) conditions.push(`employeeId=${filterEmployeeId}`);
  if (filterDate) conditions.push(`date=${filterDate}`);
  if (conditions.length) query += "&" + conditions.join("&");

  const res = await fetch(query);
  const data = await res.json();
  const container = document.getElementById("admin-records");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No records found.</p>";
    return;
  }

  data.forEach(record => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${record.employee.name}</strong> | ${record.date} | ${record.meal} (${record.mealTime})
      <button onclick="editRecord(${record.id}, '${record.meal}', '${record.mealTime}')">Edit</button>
      <button onclick="deleteRecord(${record.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function editRecord(id, currentMeal, currentTime) {
  const meal = prompt("New meal:", currentMeal);
  const time = prompt("New meal time (Lunch/Dinner):", currentTime);
  if (meal && time) {
    await fetch(`${API}/attendance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal, mealTime: time })
    });
    renderAdminRecords();
  }
}

async function deleteRecord(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    await fetch(`${API}/attendance/${id}`, { method: "DELETE" });
    renderAdminRecords();
  }
}
