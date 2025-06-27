import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true },

    specialization: { type: String },
    hospitalName: { type: String },
    hospitalFloor: { type: String },

    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },

    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', userSchema);
