# 🍽️ Employee Meal Check-In App

This is a Single Page Application (SPA) built with HTML, CSS, and JavaScript that allows employees to check in for meals (Lunch/Dinner), and enables administrators to manage check-ins, view logs, and export data.

---

## 📌 Project Features

# 🍽️ Employee Meal Check-In App

This is a **Single Page Application (SPA)** built with **HTML, CSS, and JavaScript**, designed to let employees check in for meals (Lunch/Dinner), while giving administrators access to manage records, view logs, and export data.

---

## 🚀 Features

### Employee Functionality

- Log in with SAP number and PIN**
- Select a meal and meal time
- One check-in per day is enforced

### Admin Panel

- View all check-ins for the day
- Filter by employee name and date
- Edit or delete check-ins
- Add new employees (and assign admin rights)
- View complete **attendance history.

---

## 📁 Project Structure



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

### 2. Install JSON Server 

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

##  License

This project is open-source and available under the MIT License.
