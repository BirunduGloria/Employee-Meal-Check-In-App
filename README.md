# 🍽️ Employee Meal Check-In App

This is a Single Page Application (SPA) built with HTML, CSS, and JavaScript that allows employees to check in for meals (Lunch/Dinner), and enables administrators to manage check-ins, view logs, and export data.

---

## 📌 Project Features

- Employee login via SAP Number and PIN.
- Secure check-in: each employee can only check in once per day.
- Meal selection: choose from Jollof Rice, Pasta, Swallow, Githeri.
- Choose meal time (Lunch or Dinner).
- Displays:
  - Today's check-ins
  - Daily check-in history
- Admin Panel:
  - View all check-ins
  - Filter by employee or date
  - Edit or delete check-ins
  - Export check-ins to PDF
- Quick switch to Admin login with preset credentials.
- Admin and employee views are separated.

---

## 🛠️ Tech Stack

- Frontend:** HTML, CSS, JavaScript
- Backend:** JSON Server (`db.json`)
- Data Format:** JSON
- API Communication:** Asynchronous (fetch API)

---

## 🧩 Project Structure

```bash
project-root/Employee Meal Check-In
│
├── css/
│   └── style.css
│
├── src/
│   └── index.js
│
├── db.json
├── index.html
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/employee-meal-checkin.git
cd employee-meal-checkin
```

### 2. Install JSON Server (if not already)

```bash
npm install -g json-server
```

### 3. Run the JSON Server

```bash
json-server --watch db.json --port 3000
```

### 4. Open the App

Open `index.html` in your browser.

---

##  Sample Admin Login

- **SAP: `ADMIN001`
- **PIN: `admin002`

---

## 🧪 Events & Array Methods Used

- Event listeners for:
  - Login
  - Check-in
  - Logout
  - Filter by name and date
  - Edit/Delete operations
- Array methods:
  - `forEach()` for displaying check-ins
  - `find()` for locating users
  - `filter()` for search

---

## ✅ Project Requirements Checklist

- [x] Uses HTML, CSS, and JS
- [x] Data source is JSON Server (`db.json`)
- [x] At least 5 employee objects with 3+ attributes
- [x] All interactions are asynchronous using fetch
- [x] JSON format only, no API keys
- [x] Single Page App (no redirects)
- [x] ≥ 3 Event Listeners
- [x] ≥ 1 Array iteration method
- [x] DRY code with reusable functions

---

## Author
Birundu Gloria.

## 📄 License

This project is open-source and available under the MIT License.
