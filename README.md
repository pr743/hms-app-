# 🏥 Hospital Management System (MERN)

A production-ready full-stack Hospital Management System designed to streamline hospital operations including patient management, doctor workflows, and appointment scheduling. Built with scalable architecture and secure authentication.

---

## 🚀 Overview

This system enables hospitals to efficiently manage users, appointments, and medical data with a clean UI and robust backend.

✔️ Built with industry-standard MERN stack
✔️ Follows MVC architecture
✔️ Secure authentication & protected APIs
✔️ Scalable structure for real-world usage

---

## ✨ Key Highlights

* 🔐 **Authentication & Authorization**

  * JWT-based login system with secure cookie handling
  * Role-based access (Admin / Doctor / Patient)

* 📅 **Appointment System**

  * Patients can book, view, and manage appointments
  * Doctors can approve/reject requests

* 📊 **Dashboard System**

  * Admin dashboard for managing users and system data
  * Doctor dashboard for appointments and patients

* 🗂️ **Data Management**

  * CRUD operations for patients, doctors, and records
  * Optimized MongoDB schema design

* ⚡ **Performance & UX**

  * Fast frontend using Vite
  * Responsive UI with Tailwind CSS

---

## 🧠 Architecture

* Structured using **MVC pattern**
* RESTful API design
* Modular and scalable folder structure

```
client/        → Frontend (React)
server/        → Backend (Node + Express)
controllers/   → Business logic
models/        → Database schemas
routes/        → API endpoints
middleware/    → Authentication & validation
```

---

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS
**Backend:** Node.js, Express.js, REST APIs, JWT
**Database:** MongoDB, Mongoose
**Deployment:** Vercel, Render

---

## ⚙️ Getting Started

### Clone & Install

```bash
git clone https://github.com/pr743/hms-app.git
cd hms-app
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Configuration

Create `.env` file in `/server`:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🌐 Live Preview

**Frontend:**
https://hms-app-l8ub.vercel.app/

**Backend API:**
https://full-stack-project-2-1.onrender.com/

---

##  Future Improvements

* Payment integration (for appointments)
* Email/SMS notifications
* Doctor availability scheduling
* Admin analytics dashboard

---

##  Author

**Mungra Prince**
MERN Stack Developer
GitHub: https://github.com/pr743

---

##  Support

If you found this project useful, consider giving it a ⭐ on GitHub.
