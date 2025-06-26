const API = "http://localhost:3000";
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("submit-checkin").addEventListener("click", handleCheckIn);
  document.getElementById("quick-admin-login").addEventListener("click", async () => {
    document.getElementById("sap-input").value = "ADMIN001";
    document.getElementById("pin-input").value = "admin002";
    await handleLogin();
  });

  document.getElementById("filter-employee").addEventListener("input", applyFilters);
  document.getElementById("filter-date").addEventListener("change", applyFilters);
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("filter-employee").value = "";
    document.getElementById("filter-date").value = "";
    applyFilters();
  });

  renderTodayCheckIns();
  renderDailyHistory();
});

async function handleLogin() {
  const sap = document.getElementById("sap-input").value.trim();
  const pin = document.getElementById("pin-input").value.trim();
  if (!sap || !pin) return alert("Please enter both SAP and PIN.");

  try {
    const res = await fetch(`${API}/employees`);
    const employees = await res.json();
    const user = employees.find(emp => emp.sap === sap && emp.pin === pin);

    if (!user) return alert("Invalid SAP or PIN.");

    currentUser = user;

    const isAdmin = user.isAdmin;
    document.getElementById("admin-panel").style.display = isAdmin ? "block" : "none";
    document.getElementById("admin-badge").style.display = isAdmin ? "block" : "none";
    document.getElementById("employee-section").style.display = isAdmin ? "none" : "block";
    document.getElementById("login-section").style.display = "none";
  } catch (err) {
    console.error("Login error:", err);
  }
}

async function handleCheckIn() {
  if (!currentUser) return alert("Please log in first.");
  const meal = document.getElementById("meal-select").value;
  const mealTime = document.getElementById("meal-time-select").value;
  const date = new Date().toISOString().split("T")[0];

  try {
    const res = await fetch(`${API}/attendance?employeeId=${currentUser.id}&date=${date}`);
    const alreadyChecked = await res.json();

    if (alreadyChecked.length > 0) return alert("You have already checked in today.");

    await fetch(`${API}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: currentUser.id, date, meal, mealTime })
    });

    alert("Check-in successful!");
    await renderTodayCheckIns();
    await renderDailyHistory();
    handleLogout();
  } catch (err) {
    console.error("Check-in error:", err);
  }
}

function handleLogout() {
  currentUser = null;
  document.getElementById("sap-input").value = "";
  document.getElementById("pin-input").value = "";
  document.getElementById("login-section").style.display = "block";
  document.getElementById("employee-section").style.display = "none";
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-badge").style.display = "none";
}

async function renderTodayCheckIns() {
  const today = new Date().toISOString().split("T")[0];

  try {
    const [attRes, empRes] = await Promise.all([
      fetch(`${API}/attendance?date=${today}`),
      fetch(`${API}/employees`)
    ]);
    const checkins = await attRes.json();
    const employees = await empRes.json();

    const ul = document.getElementById("checkin-list");
    ul.innerHTML = "";

    checkins.forEach(entry => {
      const emp = employees.find(e => e.id === entry.employeeId);
      if (emp) {
        const li = document.createElement("li");
        li.textContent = `${emp.name} (${emp.sap}) – ${entry.meal} [${entry.mealTime}]`;
        ul.appendChild(li);
      }
    });
  } catch (err) {
    console.error("Error loading check-ins:", err);
  }
}

async function renderDailyHistory() {
  const today = new Date().toISOString().split("T")[0];

  try {
    const [attRes, empRes] = await Promise.all([
      fetch(`${API}/attendance?date=${today}`),
      fetch(`${API}/employees`)
    ]);
    const checkins = await attRes.json();
    const employees = await empRes.json();

    const ul = document.getElementById("daily-history");
    ul.innerHTML = "";

    checkins.forEach(entry => {
      const emp = employees.find(e => e.id === entry.employeeId);
      if (emp) {
        const li = document.createElement("li");
        li.textContent = `${emp.name} (${emp.sap}) – ${entry.meal} [${entry.mealTime}]`;
        ul.appendChild(li);
      }
    });
  } catch (err) {
    console.error("Error loading history:", err);
  }
}

async function applyFilters() {
  const empQuery = document.getElementById("filter-employee").value.toLowerCase();
  const dateQuery = document.getElementById("filter-date").value;

  const [checkinsRes, employeesRes] = await Promise.all([
    fetch(`${API}/attendance`),
    fetch(`${API}/employees`)
  ]);
  const checkins = await checkinsRes.json();
  const employees = await employeesRes.json();

  const list = document.getElementById("filtered-checkins");
  list.innerHTML = "";

  checkins.forEach(entry => {
    const emp = employees.find(e => e.id === entry.employeeId);
    const matchName = empQuery ? emp.name.toLowerCase().includes(empQuery) : true;
    const matchDate = dateQuery ? entry.date === dateQuery : true;

    if (matchName && matchDate) {
      const li = document.createElement("li");
      li.textContent = `${emp.name} (${emp.sap}) – ${entry.meal} [${entry.mealTime}] on ${entry.date}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ Edit";
      editBtn.onclick = () => editCheckin(entry);

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️ Delete";
      delBtn.onclick = () => deleteCheckin(entry.id);

      li.append(editBtn, delBtn);
      list.appendChild(li);
    }
  });
}

async function deleteCheckin(id) {
  if (confirm("Are you sure you want to delete this check-in?")) {
    await fetch(`${API}/attendance/${id}`, { method: "DELETE" });
    alert("Deleted.");
    applyFilters();
    renderTodayCheckIns();
    renderDailyHistory();
  }
}

async function editCheckin(entry) {
  const newMeal = prompt("Edit meal:", entry.meal);
  const newTime = prompt("Edit meal time (Lunch/Dinner):", entry.mealTime);
  if (!newMeal || !newTime) return alert("Invalid input.");

  await fetch(`${API}/attendance/${entry.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meal: newMeal, mealTime: newTime })
  });

  alert("Updated.");
  applyFilters();
  renderTodayCheckIns();
  renderDailyHistory();
}
