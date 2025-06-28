import status from 'http-status';
import AppError from '../../errors/AppError';
import { DoctorServiceModel } from '../DoctorService/doctorService.model';
import { IAvailability } from './availability.interface';
import { AvailabilityModel } from './availability.model';

const createAvailability = async (
  payload: Partial<IAvailability>,
  doctorId: string,
): Promise<IAvailability> => {
  const { serviceId, day, timeSlots } = payload;

  if (!serviceId || !day || !timeSlots || timeSlots.length === 0) {
    throw new AppError(
      status.BAD_REQUEST,
      'Service ID, day, and time slots are required',
    );
  }

  const isServiceExist = await DoctorServiceModel.findById(serviceId);
  if (!isServiceExist) {
    throw new AppError(status.NOT_FOUND, 'Service not found');
  }

  if (isServiceExist.doctorId.toString() !== doctorId) {
    throw new AppError(status.UNAUTHORIZED, 'Unauthorized');
  }

  const duplicateDay = await AvailabilityModel.findOne({
    doctorId,
    serviceId,
    day,
  });
  if (duplicateDay) {
    throw new AppError(
      status.CONFLICT,
      `Availability already exists for ${day}`,
    );
  }

  // Check duplicates and overlaps within input
  const seen = new Set<string>();
  const isOverlap = (
    a: { startTime: string; endTime: string },
    b: { startTime: string; endTime: string },
  ): boolean => {
    return a.startTime < b.endTime && a.endTime > b.startTime;
  };

  for (let i = 0; i < timeSlots.length; i++) {
    const slotA = timeSlots[i];
    const key = `${slotA.startTime}-${slotA.endTime}`;

    if (seen.has(key)) {
      throw new AppError(status.CONFLICT, `Duplicate time slot: ${key}`);
    }
    seen.add(key);

    for (let j = i + 1; j < timeSlots.length; j++) {
      const slotB = timeSlots[j];
      if (isOverlap(slotA, slotB)) {
        throw new AppError(
          status.CONFLICT,
          `Time slot ${slotA.startTime}–${slotA.endTime} overlaps with ${slotB.startTime}–${slotB.endTime}`,
        );
      }
    }
  }

  // Check overlap with existing availabilities
  const sameDayAvailabilities = await AvailabilityModel.find({ doctorId, day });

  for (const existing of sameDayAvailabilities) {
    for (const existingSlot of existing.timeSlots) {
      for (const newSlot of timeSlots) {
        const isOverlapExisting =
          newSlot.startTime < existingSlot.endTime &&
          newSlot.endTime > existingSlot.startTime;

        if (isOverlapExisting) {
          throw new AppError(
            status.CONFLICT,
            `Time slot ${newSlot.startTime}–${newSlot.endTime} overlaps with an existing slot`,
          );
        }
      }
    }
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
