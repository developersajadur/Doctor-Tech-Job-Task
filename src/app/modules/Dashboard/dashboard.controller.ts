import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { adminDashboardService } from './dashboard.service';

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await adminDashboardService.getDashboardStats();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Dashboard statistics fetched successfully',
    data: stats,
  });
});

export const adminDashboardController = {
  getDashboardStats,
};
