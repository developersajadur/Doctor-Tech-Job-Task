import { z } from 'zod';

export const createAvailabilitySchema = z.object({
  body: z.object({
    serviceId: z.string({ required_error: 'Service ID is required' }),
    day: z.enum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]),
    timeSlots: z
      .array(
        z.object({
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
        }),
      )
      .min(1, 'At least one time slot is required'),
  }),
});
