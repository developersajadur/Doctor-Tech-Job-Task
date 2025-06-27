export const USER_ROLE = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
