import status from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { UserModel } from './user.model';

const createUserByRole = async (
  payload: Partial<IUser>,
  role: 'doctor' | 'patient',
): Promise<IUser> => {
  const existing = await UserModel.findOne({ email: payload.email });
  if (existing) {
    throw new AppError(status.CONFLICT, 'Email already in use');
  }

  const user = await UserModel.create({
    ...payload,
    role
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
