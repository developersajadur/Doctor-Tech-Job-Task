/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builders/QueryBuilder';
import { DoctorServiceModel } from '../DoctorService/doctorService.model';
import { IUser } from '../User/user.interface';
import { UserModel } from '../User/user.model';
import { doctorSearchableFields } from './doctor.constant';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { AvailabilityModel } from '../Availability/availability.model';
import { AppointmentModel } from '../Appointment/appointment.model';
import { HydratedDocument } from 'mongoose';

const getAllDoctors = async (query: Record<string, unknown>) => {
  const { serviceName, ...restQuery } = query;

  let doctorFilterIds: string[] = [];

  // Filter doctors by service name
  if (serviceName && typeof serviceName === 'string') {
    const matchingServices = await DoctorServiceModel.find({
      title: { $regex: serviceName, $options: 'i' },
    }).select('doctorId');

    doctorFilterIds = [
      ...new Set(
        matchingServices.map((service) => service.doctorId.toString()),
      ),
    ];
  }

  const baseFilter: Record<string, unknown> = {
    role: 'doctor',
    isDeleted: false,
    isBlocked: false,
  };

  if (doctorFilterIds.length > 0) {
    baseFilter._id = { $in: doctorFilterIds };
  } else if (serviceName) {
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 0 } };
  }

  // Apply filters, sorting, pagination etc.
  const doctorQuery = new QueryBuilder(UserModel.find(baseFilter), restQuery)
    .search(doctorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const doctors = await doctorQuery.modelQuery;

  const enrichedDoctors = await Promise.all(
    doctors.map(async (doctor: HydratedDocument<IUser>) => {
      const services = await DoctorServiceModel.find({ doctorId: doctor._id });
      return {
        ...doctor.toObject(),
        services,
      };
    }),
  );

  const meta = await doctorQuery.countTotal();

  return { data: enrichedDoctors, meta };
};

const getDoctorProfile = async (doctorId: string) => {
  const doctor = await UserModel.findOne({
    _id: doctorId,
    role: 'doctor',
    isDeleted: false,
    isBlocked: false,
  }).select('name email phone specialization hospitalName hospitalFloor');

  if (!doctor) {
    throw new AppError(status.NOT_FOUND, 'Doctor Not Found');
  }

  const services = await DoctorServiceModel.find({ doctorId });
  const availabilities = await AvailabilityModel.find({ doctorId });
  const appointments = await AppointmentModel.find({
    doctorId,
    status: { $in: ['pending', 'accepted', 'completed'] },
  });

  // Build set of booked timeSlotIds per serviceId and selectedDate
  const bookedSlotMap = new Map<string, Set<string>>();
  for (const appointment of appointments) {
    const serviceId = appointment.serviceId.toString();
    const timeSlotId = appointment.timeSlotId.toString();

    if (!bookedSlotMap.has(serviceId)) {
      bookedSlotMap.set(serviceId, new Set());
    }

    bookedSlotMap.get(serviceId)!.add(timeSlotId);
  }

  const availabilityByService: Record<string, Record<string, any[]>> = {};

  for (const avail of availabilities) {
    const serviceIdStr = avail.serviceId.toString();
    const availableSlots = avail.timeSlots.filter((slot) => {
      const bookedSlots = bookedSlotMap.get(serviceIdStr);
      return !bookedSlots?.has(slot._id.toString());
    });

    if (availableSlots.length > 0) {
      if (!availabilityByService[serviceIdStr]) {
        availabilityByService[serviceIdStr] = {};
      }
      if (!availabilityByService[serviceIdStr][avail.day]) {
        availabilityByService[serviceIdStr][avail.day] = [];
      }

      availabilityByService[serviceIdStr][avail.day].push({
        _id: avail._id,
        timeSlots: availableSlots,
      });
    }
  }

  return {
    doctor: doctor.toObject(),
    services: services.map((service) => {
      const serviceIdStr = service._id.toString();
      return {
        ...service.toObject(),
        availability: availabilityByService[serviceIdStr] || {},
      };
    }),
  };
};

export const doctorService = {
  getAllDoctors,
  getDoctorProfile,
};
