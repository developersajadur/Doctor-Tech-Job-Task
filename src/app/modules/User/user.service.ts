import status from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { UserModel } from './user.model';
import bcrypt from 'bcrypt';

const createUserByRole = async (
  payload: Partial<IUser>,
  role: 'doctor' | 'patient',
): Promise<IUser> => {
  const existing = await UserModel.findOne({ email: payload.email });
  if (existing) {
    throw new AppError(status.CONFLICT, 'Email already in use');
  }

  const saltRounds = parseInt(config.salt_rounds as string, 10) || 10;

  const hashedPassword = await bcrypt.hash(payload.password!, saltRounds);

  const user = await UserModel.create({
    ...payload,
    password: hashedPassword,
    role,
  });

  return user;
};

const createDoctor = (payload: Partial<IUser>) =>
  createUserByRole(payload, 'doctor');
const createPatient = (payload: Partial<IUser>) =>
  createUserByRole(payload, 'patient');

export const userService = {
  createDoctor,
  createPatient,
};
