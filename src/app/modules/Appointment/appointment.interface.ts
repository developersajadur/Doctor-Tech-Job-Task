import { Types } from 'mongoose';
import { TAppointmentStatus } from './appointment.constant';

export interface IAppointment {
  _id?: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  serviceId: Types.ObjectId;
  selectedDate: string;
  timeSlotId: Types.ObjectId;
  status: TAppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
