

import { z } from 'zod';

 const createDoctorServiceValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    duration: z.number().positive('Duration must be positive (in minutes)'),
  }),
});


export const doctorServiceSchema = {
  createDoctorServiceValidation
}