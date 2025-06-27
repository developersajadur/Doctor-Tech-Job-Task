import { Router } from 'express';
import { authRoute } from '../modules/Auth/auth.route';
import { userRoutes } from '../modules/User/user.route';
import { DoctorServiceRoutes } from '../modules/DoctorService/doctorService.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
