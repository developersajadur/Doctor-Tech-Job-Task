import { z } from 'zod';

export const createAppointmentValidation = z.object({
  body: z.object({
    doctorId: z.string({ required_error: 'Doctor ID is required' }).min(1),
    serviceId: z.string({ required_error: 'Service ID is required' }).min(1),
    selectedDate: z.string({ required_error: 'Date is required' }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timeSlotId: z.string({ required_error: 'Time Slot ID is required' }).min(1),
  }),
});



export const appointmentValidation = {
  createAppointmentValidation
};
