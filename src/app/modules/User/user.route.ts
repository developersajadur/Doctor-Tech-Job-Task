
import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationSchema } from './user.validation';

const router = express.Router();

router.post(
  '/register-doctor',
  validateRequest(userValidationSchema.registerDoctorValidation),
  userController.createDoctor
);

router.post(
  '/register-patient',
  validateRequest(userValidationSchema.registerPatientValidation),
  userController.createPatient
);

export const userRoutes = router;
