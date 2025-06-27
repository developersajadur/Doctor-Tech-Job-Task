
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { doctorServiceService } from './doctorService.service';
import { TTokenUser } from '../../middlewares/auth';
import { Request } from 'express';
import AppError from '../../errors/AppError';

const createDoctorService = catchAsync(async (req:Request &{user?: TTokenUser}, res) => {
  const doctorId = await req.user?.userId; 
  if(!doctorId){
    throw new AppError(status.UNAUTHORIZED, "Unauthorized, Doctor Id Not Found")
  }

  const service = await doctorServiceService.createDoctorService(req.body, doctorId);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Service created successfully',
    data: service,
  });
});

export const doctorServiceController = {
  createDoctorService,
};
