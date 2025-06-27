import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';
import { appointmentService } from './appointment.service';
import { Request } from 'express';
import { TTokenUser } from '../../middlewares/auth';
import AppError from '../../errors/AppError';
import { AppointmentStatuses } from './appointment.constant';

const bookAppointment = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const patientId = req.user?.userId;
    if (!patientId) throw new AppError(status.UNAUTHORIZED, 'Unauthorized');

    const appointment = await appointmentService.bookAppointment(
      req.body,
      patientId,
    );

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  },
);

const getPatientAppointments = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const patientId = req.user?.userId;
    const appointments = await appointmentService.getPatientAppointments(
      patientId!,
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Patient appointments fetched',
      data: appointments,
    });
  },
);

const getDoctorAppointments = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const doctorId = req.user?.userId;
    const appointments = await appointmentService.getDoctorAppointments(
      doctorId!,
      req.query.status as string,
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Doctor appointments fetched',
      data: appointments,
    });
  },
);

const updateAppointmentStatus = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const doctorId = req.user?.userId;
    const { id, status: appointmentStatus } = req.params;

    if (
      !AppointmentStatuses.includes(
        appointmentStatus as 'accepted' | 'cancelled' | 'completed',
      )
    ) {
      throw new AppError(status.BAD_REQUEST, 'Invalid appointment status');
    }

    const result = await appointmentService.updateAppointmentStatus(
      id,
      doctorId!,
      appointmentStatus as 'accepted' | 'cancelled' | 'completed',
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Appointment status updated',
      data: result,
    });
  },
);
export const appointmentController = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};
