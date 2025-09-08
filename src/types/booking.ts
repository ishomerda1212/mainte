export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
}

export interface WeeklySchedule {
  [dayOfWeek: string]: {
    enabled: boolean;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
}

export interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string;
  secondChoice?: string;
  notes?: string;
  createdAt: Date;
}

export interface BookingFormData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  secondChoice: string;
  notes: string;
}

export interface BookingFormConfig {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingFormConfigData {
  title: string;
  description: string;
  duration: number;
}

export interface Customer {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFormData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  notes: string;
}