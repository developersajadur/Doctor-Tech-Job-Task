import { z } from 'zod';

const createDoctorServiceValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    duration: z.number().positive('Duration must be positive (in minutes)'),
  }),
});
const updateDoctorServiceValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().positive('Price must be positive').optional(),
    duration: z
      .number()
      .positive('Duration must be positive (in minutes)')
      .optional(),
  }),
});

export const doctorServiceSchema = {
  createDoctorServiceValidation,
  updateDoctorServiceValidation,
};
