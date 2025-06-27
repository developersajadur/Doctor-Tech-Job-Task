
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { userService } from './user.service';

const createDoctor = catchAsync(async (req, res) => {
  const user = await userService.createDoctor(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Doctor Account registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});
const createPatient = catchAsync(async (req, res) => {
  const user = await userService.createPatient(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Patient Account registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export const userController = {
  createPatient,
  createDoctor
};
