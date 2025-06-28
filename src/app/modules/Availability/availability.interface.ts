import { Types } from 'mongoose';

export const WeekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type TWeekDay = (typeof WeekDays)[number];

export interface IAvailability {
  _id: Types.ObjectId;
  doctorId: Types.ObjectId;
  serviceId: Types.ObjectId;
  day: TWeekDay;
  timeSlots: {
    _id: Types.ObjectId;
    startTime: string;
    endTime: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
