import status from 'http-status';
import AppError from '../../errors/AppError';
import { DoctorServiceModel } from '../DoctorService/doctorService.model';
import { IAvailability } from './availability.interface';
import { AvailabilityModel } from './availability.model';

const createAvailability = async (
  payload: Partial<IAvailability>,
  doctorId: string,
): Promise<IAvailability> => {
  const isServiceExist = await DoctorServiceModel.findById(payload.serviceId);
  if (!isServiceExist) {
    throw new AppError(status.NOT_FOUND, 'Service Not Found');
  }
  if (isServiceExist.doctorId.toString() !== doctorId) {
    throw new AppError(status.UNAUTHORIZED, 'Unauthorize');
  }

  const availability = await AvailabilityModel.create({
    ...payload,
    doctorId,
  });

  return availability;
};

export const availabilityService = {
  createAvailability,
};
