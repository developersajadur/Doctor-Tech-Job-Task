
import { Schema, model } from 'mongoose';
import { IDoctorService } from './doctorService.interface';

const serviceSchema = new Schema<IDoctorService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const DoctorServiceModel = model<IDoctorService>('Doctor-Service', serviceSchema);
