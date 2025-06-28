# 🩺 Doctor Tech — Online Doctor Appointment Platform

Doctor Tech is a full-stack web application for managing doctor appointments, built with Node.js, Express, MongoDB, and TypeScript. It allows patients to book appointments, doctors to manage their schedules, and admins to oversee the entire platform.

## 🔗 Links
- 🌐 Live Site: [Add your live URL here]
- 📂 GitHub Repository: [https://github.com/yourusername/doctor-tech]
- 📬 Postman Collection: [Add your Postman collection link here]

## 📦 Features
- 👨‍⚕️ Doctor registration, services, and time-slot availability
- 🧑‍🦱 Patient registration and appointment booking
- 📅 Calendar-based availability filtering
- 📧 Email notifications on appointment status change
- 🛡️ Role-based access (Admin, Doctor, Patient)
- 📊 Admin dashboard with stats
- 🔒 Secure authentication & authorization
- 🧪 Postman Collection for testing

## 🚀 Tech Stack
**Backend:** Node.js, Express, TypeScript  
**Database:** MongoDB with Mongoose  
**Authentication:** JWT  
**Email:** Nodemailer + Handlebars Templates  
**Tools:** ESLint, Prettier, dotenv, Husky  

## 🛠️ Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/doctor-tech.git
cd doctor-tech
2. Install Dependencies
bash
npm install
3. Configure Environment
Create .env file:

env
PORT=5000
DATABASE_URL=mongodb+srv://your-db-url
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL=your_email@gmail.com
APP_PASSWORD=your_app_password
DEFAULT_ADMIN_EMAIL=admin@doctor-tech.com
DEFAULT_ADMIN_PHONE=01234567890
DEFAULT_ADMIN_PASSWORD=admin123
SEED_SECRET=seed-admin-secret
4. Start Development Server
bash
npm run dev
🌱 Admin Setup
Seed default admin:

bash
POST /api/v1/seed-admin?secret=your_seed_secret
Creates admin with:

json
{
  "email": "admin@doctor-tech.com",
  "password": "admin123"
}
🧪 API Testing
Import the Postman collection and set environment variables:

BASE_URL: http://localhost:5000

TOKEN: Your JWT token

📝 Sample Requests
Register Doctor
http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "password": "doctor123",
  "phone": "01712345678",
  "role": "doctor"
}
Create Service
http
POST /api/v1/services
Content-Type: application/json
Authorization: Bearer <doctor_token>

{
  "title": "General Checkup",
  "description": "Routine health examination",
  "price": 800,
  "duration": 30,
  "doctorId": "doctorObjectId"
}
Set Availability
http
POST /api/v1/availability
Content-Type: application/json
Authorization: Bearer <doctor_token>

{
  "serviceId": "serviceObjectId",
  "day": "Monday",
  "timeSlots": [
    {"startTime": "09:00", "endTime": "11:00"},
    {"startTime": "14:00", "endTime": "16:00"}
  ]
}
📊 Admin Dashboard
http
GET /api/v1/admin/dashboard
Authorization: Bearer <admin_token>
Response:

json
{
  "totalDoctors": 15,
  "totalPatients": 42,
  "totalAppointments": 87
}
📧 Email Notifications
Configure in .env:

env
EMAIL=your_email@gmail.com
APP_PASSWORD=your_app_password
Templates include:

Appointment confirmation

Status updates

Reminders
