import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { availabilityService } from './availability.service';
import { Request } from 'express';
import { TTokenUser } from '../../middlewares/auth';
import AppError from '../../errors/AppError';

const createAvailability = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const doctorId = req.user?.userId;
    if (!doctorId) {
      throw new AppError(status.UNAUTHORIZED, 'Unauthorized doctor');
    }

    const availability = await availabilityService.createAvailability(
      req.body,
      doctorId
    );

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'Availability set successfully',
      data: availability,
    });
  }
);

export const availabilityController = {
  createAvailability,
};
