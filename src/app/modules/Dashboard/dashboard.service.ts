import { UserModel } from '../User/user.model';
import { AppointmentModel } from '../Appointment/appointment.model';

const getDashboardStats = async () => {
  const totalDoctorsPromise = UserModel.countDocuments({
    role: 'doctor',
    isDeleted: false,
  });
  const totalPatientsPromise = UserModel.countDocuments({
    role: 'patient',
    isDeleted: false,
  });
  const totalAppointmentsPromise = AppointmentModel.countDocuments();
  const totalUsersPromise = UserModel.countDocuments({ isDeleted: false });

  const [totalDoctors, totalPatients, totalAppointments, totalUsers] =
    await Promise.all([
      totalDoctorsPromise,
      totalPatientsPromise,
      totalAppointmentsPromise,
      totalUsersPromise,
    ]);

  return {
    totalDoctors,
    totalPatients,
    totalAppointments,
    totalUsers,
  };
};

export const adminDashboardService = {
  getDashboardStats,
};
