import express from 'express';
import auth from '../../middlewares/auth';
import { adminDashboardController } from './dashboard.controller';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/admin/dashboard',
  auth(USER_ROLE.ADMIN),
  adminDashboardController.getDashboardStats,
);

export const dashboardRoutes = router;
