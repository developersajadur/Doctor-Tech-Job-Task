import { Schema, model } from 'mongoose';
import { AppointmentStatuses } from './appointment.constant';
import { IAppointment } from './appointment.interface';

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor-Service',
      required: true,
    },
    selectedDate: { type: String, required: true },
    timeSlotId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Availability.timeSlots',
    },
    status: {
      type: String,
      enum: AppointmentStatuses,
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const AppointmentModel = model<IAppointment>(
  'Appointment',
  appointmentSchema,
);
