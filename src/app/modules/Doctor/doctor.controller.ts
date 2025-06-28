import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { doctorService } from './doctor.service';

const getAllDoctors = catchAsync(async (req, res) => {
  const result = await doctorService.getAllDoctors(req.query);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Doctors retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getDoctorProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const profile = await doctorService.getDoctorProfile(id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Doctor profile fetched successfully',
    data: profile,
  });
});

export const doctorController = {
  getAllDoctors,
  getDoctorProfile,
};
