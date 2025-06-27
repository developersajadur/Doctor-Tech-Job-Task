
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { doctorServiceService } from './doctorService.service';
import { TTokenUser } from '../../middlewares/auth';
import { Request } from 'express';
import AppError from '../../errors/AppError';

const createDoctorService = catchAsync(async (req:Request &{user?: TTokenUser}, res) => {
  const doctorId =  req.user?.userId; 
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


const updateDoctorService = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const doctorId = req.user?.userId;
    const serviceId = req.params.id;

    if (!doctorId || !serviceId)
      throw new AppError(status.BAD_REQUEST, 'Invalid request');

    const updated = await doctorServiceService.updateDoctorService(
      serviceId,
      doctorId,
      req.body
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  }
);

// DELETE
const deleteDoctorService = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const doctorId = req.user?.userId;
    const serviceId = req.params.id;

    if (!doctorId || !serviceId)
      throw new AppError(status.BAD_REQUEST, 'Invalid request');

    const deleted = await doctorServiceService.deleteDoctorService(
      serviceId,
      doctorId
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Service deleted successfully',
      data: deleted,
    });
  }
);


export const doctorServiceController = {
  createDoctorService,
  updateDoctorService,
  deleteDoctorService
};
