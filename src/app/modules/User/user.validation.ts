import { z } from 'zod';

const registerDoctorValidation = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(6),
    specialization: z.string(),
    hospitalName: z.string(),
    hospitalFloor: z.string(),
  }),
});

const registerPatientValidation = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(6),
    age: z.number(),
    gender: z.enum(['male', 'female', 'other']),
  }),
});


export const userValidationSchema = {
  registerDoctorValidation,
  registerPatientValidation,
};
