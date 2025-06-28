import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { availabilityController } from './availability.controller';
import { createAvailabilitySchema } from './availability.validation';

const router = express.Router();

router.post(
  '/create-availability',
  auth(USER_ROLE.DOCTOR),
  validateRequest(createAvailabilitySchema),
  availabilityController.createAvailability,
);

export const availabilityRoutes = router;
