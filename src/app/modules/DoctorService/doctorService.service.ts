import status from 'http-status';
import AppError from '../../errors/AppError';
import { IDoctorService } from './doctorService.interface';
import { DoctorServiceModel } from './doctorService.model';
import mongoose from 'mongoose';

const createDoctorService = async (
  payload: Partial<IDoctorService>,
  doctorId: string,
): Promise<IDoctorService> => {
  const service = await DoctorServiceModel.create({
    ...payload,
    doctorId,
  });

  return service;
};

const updateDoctorService = async (
  serviceId: string,
  doctorId: string,
  payload: Partial<IDoctorService>,
): Promise<IDoctorService> => {
  const isServiceExist = await DoctorServiceModel.findById(serviceId);

  if (!isServiceExist) {
    throw new AppError(status.NOT_FOUND, 'Service not found');
  }

  if (isServiceExist.doctorId.toString() !== doctorId) {
    throw new AppError(status.UNAUTHORIZED, 'Unauthorized: Not your service');
  }

  const updatedService = await DoctorServiceModel.findOneAndUpdate(
    { _id: serviceId, doctorId: new mongoose.Types.ObjectId(doctorId) },
    payload,
    { new: true },
  );

  if (!updatedService) {
    throw new AppError(status.NOT_FOUND, 'Failed to update service');
  }

  return updatedService;
};

const deleteDoctorService = async (
  serviceId: string,
  doctorId: string,
): Promise<IDoctorService> => {
  const isServiceExist = await DoctorServiceModel.findById(serviceId);

  if (!isServiceExist) {
    throw new AppError(status.NOT_FOUND, 'Service not found');
  }

  if (isServiceExist.doctorId.toString() !== doctorId) {
    throw new AppError(status.UNAUTHORIZED, 'Unauthorized: Not your service');
  }

  const deletedService = await DoctorServiceModel.findOneAndDelete({
    _id: serviceId,
    doctorId: new mongoose.Types.ObjectId(doctorId),
  });

  if (!deletedService) {
    throw new AppError(status.NOT_FOUND, 'Failed to delete service');
  }

  return deletedService;
};

export const doctorServiceService = {
  createDoctorService,
  updateDoctorService,
  deleteDoctorService,
};
