import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidationSchema } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = Router();

router.post(
  '/auth/login',
  validateRequest(AuthValidationSchema.loginUserValidation),
  AuthControllers.loginUser,
);

export const authRoute = router;
