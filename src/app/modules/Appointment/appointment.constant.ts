export const AppointmentStatuses = ['pending', 'accepted', 'cancelled', 'completed'] as const;

export type TAppointmentStatus = typeof AppointmentStatuses[number];
