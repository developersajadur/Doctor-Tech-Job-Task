import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { appointmentController } from './appointment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { appointmentValidation } from './appointment.validation';

const router = express.Router();


router.get(
  '/doctor/appointments',
  auth(USER_ROLE.DOCTOR),
  appointmentController.getDoctorAppointments
);


router.patch(
  '/doctor/appointments/:id/:status',
  auth(USER_ROLE.DOCTOR),
  appointmentController.updateAppointmentStatus
);

router.post(
  '/appointments',
  auth(USER_ROLE.PATIENT),
  validateRequest(appointmentValidation.createAppointmentValidation),
  appointmentController.bookAppointment
);


router.get(
  '/patient/appointments',
  auth(USER_ROLE.PATIENT),
  appointmentController.getPatientAppointments
);


export const appointmentRoutes = router;
