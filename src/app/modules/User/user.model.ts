import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: 0 },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient'],
      required: true,
    },

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
  },
);

// Password hashing
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  const hashedPassword = await bcrypt.hash(
    user.password as string,
    Number(config.salt_rounds),
  );
  user.password = hashedPassword;

  next();
});

export const UserModel = model<IUser>('User', userSchema);
