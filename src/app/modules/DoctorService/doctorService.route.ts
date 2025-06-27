
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { doctorServiceSchema } from './doctorService.validation';
import { doctorServiceController } from './doctorService.controller';

const router = express.Router();

router.post(
  '/services',
  auth(USER_ROLE.DOCTOR),
  validateRequest(doctorServiceSchema.createDoctorServiceValidation),
  doctorServiceController.createDoctorService
);

router.patch(
  '/services/:id',
  auth(USER_ROLE.DOCTOR),
   validateRequest(doctorServiceSchema.updateDoctorServiceValidation),
  doctorServiceController.updateDoctorService
);

router.delete(
  '/services/:id',
  auth(USER_ROLE.DOCTOR),
  doctorServiceController.deleteDoctorService
);

export const DoctorServiceRoutes = router;
