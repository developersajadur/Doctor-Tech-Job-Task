/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppointmentModel } from './appointment.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import mongoose from 'mongoose';
import { DoctorServiceModel } from '../DoctorService/doctorService.model';
import { IAppointment } from './appointment.interface';
import { UserModel } from '../User/user.model';
import { USER_ROLE } from '../User/user.constant';
import { TAppointmentStatus } from './appointment.constant';

const bookAppointment = async (
  payload: Partial<IAppointment>,
  patientId: string
): Promise<IAppointment> => {
  const { doctorId, serviceId, selectedDate, timeSlotId } = payload;

  if (!doctorId || !serviceId || !selectedDate || !timeSlotId) {
    throw new AppError(status.BAD_REQUEST, 'Missing required fields');
  }

  const isExistDoctor = await UserModel.findOne({
    _id: doctorId,
    role: USER_ROLE.DOCTOR,
    isDeleted: false
  })
  if(!isExistDoctor){
       throw new AppError(status.NOT_FOUND, 'Doctor Not Found');
  }else if(isExistDoctor.isBlocked){
       throw new AppError(status.UNAUTHORIZED, 'Doctor Is Blocked');
  }

  const isServiceExist = await DoctorServiceModel.findOne({
    _id: serviceId,
    doctorId,
  });
  if (!isServiceExist) {
    throw new AppError(status.NOT_FOUND, 'Service Not Found');
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

  return appointment;
};

const getPatientAppointments = async (patientId: string) => {
  return AppointmentModel.find({ patientId })
    .populate('doctorId', 'name email specialization')
    .populate('serviceId', 'title price duration');
};

const getDoctorAppointments = async (doctorId: string, status?: string) => {
  const query: any = { doctorId };
  if (status) query.status = status;

  return AppointmentModel.find(query)
    .populate('patientId', 'name email')
    .populate('serviceId', 'title price duration');
};



const updateAppointmentStatus = async (
  appointmentId: string,
  doctorId: string,
  newStatus: TAppointmentStatus,
) => {
    const allowedTransitions: Record<TAppointmentStatus, TAppointmentStatus[]> = {
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
    throw new AppError(status.NOT_FOUND, 'Appointment not found or unauthorized');
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

  return appointment;
};

export const appointmentService = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};
