import { Router } from 'express';
import { authRoute } from '../modules/Auth/auth.route';
import { userRoutes } from '../modules/User/user.route';
import { DoctorServiceRoutes } from '../modules/DoctorService/doctorService.route';
import { availabilityRoutes } from '../modules/Availability/availability.route';
import { appointmentRoutes } from '../modules/Appointment/appointment.route';
import { doctorRoutes } from '../modules/Doctor/doctor.route';
import { dashboardRoutes } from '../modules/Dashboard/dashboard.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/',
    route: authRoute,
  },
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/doctor',
    route: DoctorServiceRoutes,
  },
  {
    path: '/availability',
    route: availabilityRoutes,
  },
  {
    path: '/',
    route: appointmentRoutes,
  },
  {
    path: '/',
    route: doctorRoutes,
  },
  {
    path: '/',
    route: dashboardRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
