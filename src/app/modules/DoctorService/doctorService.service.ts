import { IDoctorService } from "./doctorService.interface";
import { DoctorServiceModel } from "./doctorService.model";


const createDoctorService = async (
  payload: Partial<IDoctorService>,
  doctorId: string
): Promise<IDoctorService> => {
  const service = await DoctorServiceModel.create({
    ...payload,
    doctorId,
  });

  return service;
};

export const doctorServiceService = {
  createDoctorService,
};
