import { Types } from 'mongoose';

export interface IDoctorService {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  duration: number;
  doctorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
