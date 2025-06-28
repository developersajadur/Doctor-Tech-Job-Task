import express from 'express';
import { doctorController } from './doctor.controller';

const router = express.Router();

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorProfile);

export const doctorRoutes = router;
