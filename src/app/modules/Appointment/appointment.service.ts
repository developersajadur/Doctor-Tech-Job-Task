/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppointmentModel } from './appointment.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import mongoose from 'mongoose';
import { DoctorServiceModel } from '../DoctorService/doctorService.model';
import { IAppointment } from './appointment.interface';
import { UserModel } from '../User/user.model';
import { USER_ROLE } from '../User/user.constant';
import {
  doctorAppointmentSearchableFields,
  patientAppointmentSearchableFields,
  TAppointmentStatus,
} from './appointment.constant';
import { AvailabilityModel } from '../Availability/availability.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { EmailHelper } from '../../helpers/emailHelper';

const bookAppointment = async (
  payload: Partial<IAppointment>,
  patientId: string,
): Promise<IAppointment> => {
  const { doctorId, serviceId, selectedDate, timeSlotId } = payload;

  if (!doctorId || !serviceId || !selectedDate || !timeSlotId) {
    throw new AppError(status.BAD_REQUEST, 'Missing required fields');
  }

  const doctor = await UserModel.findOne({
    _id: doctorId,
    role: USER_ROLE.DOCTOR,
    isDeleted: false,
  });

  if (!doctor) {
    throw new AppError(status.NOT_FOUND, 'Doctor not found');
  }
  if (doctor.isBlocked) {
    throw new AppError(status.UNAUTHORIZED, 'Doctor is blocked');
  }

  const service = await DoctorServiceModel.findOne({
    _id: serviceId,
    doctorId,
  });

  if (!service) {
    throw new AppError(status.NOT_FOUND, 'Service not found');
  }

  const availability = await AvailabilityModel.findOne({
    doctorId,
    serviceId,
  });

  if (!availability) {
    throw new AppError(status.NOT_FOUND, 'Availability not found');
  }

  const isTimeSlotExist = availability.timeSlots.some(
    (slot) => slot._id.toString() === timeSlotId.toString(),
  );

  if (!isTimeSlotExist) {
    throw new AppError(status.NOT_FOUND, 'Time slot not found');
  }

  const conflict = await AppointmentModel.findOne({
    doctorId,
    serviceId,
    selectedDate,
    timeSlotId,
    status: { $in: ['pending', 'accepted'] },
  });

  if (conflict) {
    throw new AppError(status.CONFLICT, 'Time slot already booked');
  }

  const appointment = await AppointmentModel.create({
    doctorId,
    serviceId,
    selectedDate,
    timeSlotId,
    patientId,
    status: 'pending',
  });

  const patient = await UserModel.findById(patientId);

  if (appointment && patient) {
    const emailContent = await EmailHelper.createEmailContent(
      {
        patientName: patient.name,
        doctorName: doctor.name,
        serviceTitle: service.title,
        date: appointment.selectedDate,
        time: 'See appointment panel',
        status: appointment.status,
      },
      'appointment-status',
    );

    await EmailHelper.sendEmail(
      patient.email,
      emailContent,
      `Your appointment is ${appointment.status}`,
    );
  }

  return appointment;
};

const getPatientAppointments = async (
  patientId: string,
  query: Record<string, unknown>,
) => {
  const baseFilter = { patientId };

  const appointmentQuery = new QueryBuilder(
    AppointmentModel.find(baseFilter)
      .populate('doctorId', 'name email specialization')
      .populate('serviceId', 'title price duration'),
    query,
  )
    .search(patientAppointmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await appointmentQuery.modelQuery;
  const meta = await appointmentQuery.countTotal();

  return { data: result, meta };
};

const getDoctorAppointments = async (
  doctorId: string,
  query: Record<string, unknown>,
) => {
  const baseFilter: Record<string, any> = { doctorId };

  // Optionally apply status filter from query
  if (query.status && typeof query.status === 'string') {
    baseFilter.status = query.status;
  }

  const appointmentQuery = new QueryBuilder(
    AppointmentModel.find(baseFilter)
      .populate('patientId', 'name email')
      .populate('serviceId', 'title price duration'),
    query,
  )
    .search(doctorAppointmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await appointmentQuery.modelQuery;
  const meta = await appointmentQuery.countTotal();

  return { data: result, meta };
};

const updateAppointmentStatus = async (
  appointmentId: string,
  doctorId: string,
  newStatus: TAppointmentStatus,
): Promise<any> => {
  const allowedTransitions: Record<TAppointmentStatus, TAppointmentStatus[]> = {
    available: ['pending'],
    pending: ['accepted', 'cancelled'],
    accepted: ['completed', 'cancelled'],
    cancelled: [],
    completed: [],
  };

  const appointment = await AppointmentModel.findOne({
    _id: appointmentId,
    doctorId: new mongoose.Types.ObjectId(doctorId),
  });

  if (!appointment) {
    throw new AppError(
      status.NOT_FOUND,
      'Appointment not found or unauthorized',
    );
  }

  const currentStatus = appointment.status as TAppointmentStatus;

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new AppError(
      status.BAD_REQUEST,
      `Cannot change status from '${currentStatus}' to '${newStatus}'`,
    );
  }

  appointment.status = newStatus;
  await appointment.save();

  await appointment.populate([
    { path: 'patientId', select: 'name email' },
    { path: 'doctorId', select: 'name' },
    { path: 'serviceId', select: 'title' },
  ]);

  const emailContent = await EmailHelper.createEmailContent(
    {
      patientName: (appointment.patientId as any)?.name,
      doctorName: (appointment.doctorId as any)?.name,
      serviceTitle: (appointment.serviceId as any)?.title,
      date: appointment.selectedDate,
      time: 'See appointment panel',
      status: newStatus,
    },
    'appointment-status',
  );

  await EmailHelper.sendEmail(
    (appointment.patientId as any)?.email,
    emailContent,
    `Your appointment has been ${newStatus}`,
  );

  return appointment;
};

export const appointmentService = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};
