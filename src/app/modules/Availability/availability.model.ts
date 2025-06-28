import { Schema, model } from 'mongoose';
import { IAvailability, WeekDays } from './availability.interface';

const timeSlotSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: true },
);

const availabilitySchema = new Schema<IAvailability>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor-Service',
      required: true,
    },
    day: { type: String, enum: WeekDays, required: true },
    timeSlots: { type: [timeSlotSchema], required: true },
  },
  { timestamps: true },
);

export const AvailabilityModel = model<IAvailability>(
  'Availability',
  availabilitySchema,
);
