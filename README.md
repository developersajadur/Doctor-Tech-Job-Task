# 🩺 Doctor Tech — Online Doctor Appointment Platform

Doctor Tech is a full-stack web application for managing doctor appointments, built with Node.js, Express, MongoDB, and TypeScript. It allows patients to book appointments, doctors to manage their schedules, and admins to oversee the entire platform.

## 🔗 Links
- 🌐 Live Site: Sorry, I can't provide for security issues
- 📂 GitHub Repository: [https://github.com/yourusername/doctor-tech]
- 📬 Postman Collection: [https://github.com/developersajadur/Doctor-Tech-Job-Task/blob/main/doctor_tech_postman_collection]

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
https://github.com/developersajadur/Doctor-Tech-Job-Task
cd Doctor-Tech-Job-Task
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment
#### Create .env file:
```bash
# Environment
NODE_ENV=development
PORT=5000

# MongoDB Connection
DATABASE_URL=your_mongodb_connection_string

# Bcrypt Salt
SALT_ROUNDS=12

# JWT Config
JWT_TOKEN_SECRET=your_jwt_secret_key
JWT_TOKEN_EXPIRES_IN=30d

# Default Admin Credentials
DEFAULT_ADMIN_EMAIL=admin@gmail.com
DEFAULT_ADMIN_PASSWORD=Admin@123
DEFAULT_ADMIN_PHONE=01000000000

# Email SMTP Credentials (Gmail)
EMAIL=your_email@gmail.com
APP_PASSWORD=your_app_specific_password

```

### 4. Start Development Server
```bash
npm run dev
```

### 🌱 Admin Setup
Seed default admin:

```bash
POST /api/v1/seed-admin?secret=your_seed_secret
```

### 🧪 API Testing
Import the Postman collection and set environment variables:

```bash
BASE_URL: http://localhost:5000/api/v1/
```

### 📝 Sample Requests
#### Register Doctor
Content-Type: application/json
Method: POST
```bash
/api/v1/auth/register-doctor
```

```bash
{
  "name": "Doctor pro",
  "email": "doctorpro@gmail.com",
  "phone": "01712345675",
  "password": "DoctorPro@123",
  "specialization": "Cardiology",
  "hospitalName": "City Hospital",
  "hospitalFloor": "3rd Floor"
}
```

#### Register Patient
Content-Type: application/json
Method: POST
```bash
/api/v1/auth/register-patient
```

```bash
{
  "name": "Patient pro",
  "email": "patientpro@gmail.com",
  "phone": "01898765462",
  "password": "PatientPro@123",
  "age": 18,
  "gender": "male"
}
```

### Seed Admin
```bash
POST /api/v1/auth/admin/seed
```

#### Create Service
Content-Type: application/json
Authorization: token (Doctor Token)
Method: POST
```bash
/api/v1/doctor/services
```

```bash
{
  "title": "Diabetes Consultation",
  "description": "Consultation for diabetes treatment and management.",
  "price": 1500,
  "duration": 30
}
```

### Set Availability
Content-Type: application/json
Authorization: token (Doctor Token)
Method: POST
```bash
/api/v1/availability/create-availability
```

```bash
{
  "serviceId": "685f1a9d3a56063a2f956f3a",
  "day": "Wednesday",
  "timeSlots": [
    { "startTime": "10:00", "endTime": "12:00" },
    { "startTime": "16:00", "endTime": "18:00" }
  ]
}
```

### Book A Appointment
Content-Type: application/json
Authorization: token (Patient Token)
Method: POST
```bash
/api/v1/appointments
```

```bash
{
  "doctorId": "685f0c018c5f018b440b1615",
  "serviceId": "685f1a9d3a56063a2f956f3a",
  "selectedDate": "2025-07-06",
  "timeSlotId": "685fffddfc319a0f427f54ae"
}
```

