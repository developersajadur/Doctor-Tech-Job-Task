export const AppointmentStatuses = [
  'available',
  'pending',
  'accepted',
  'cancelled',
  'completed',
] as const;

export type TAppointmentStatus = (typeof AppointmentStatuses)[number];

export const patientAppointmentSearchableFields = [
  'doctorId.name',
  'doctorId.email',
  'serviceId.title',
];
export const doctorAppointmentSearchableFields = [
  'patientId.name',
  'patientId.email',
  'serviceId.title',
];
