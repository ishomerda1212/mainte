import { useState, useCallback } from 'react';
import { Booking, BookingFormData, WeeklySchedule, DaySchedule } from '../types/booking';

const defaultWeeklySchedule: WeeklySchedule = {
  '月': {
    enabled: true,
    timeSlots: [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '15:00', endTime: '16:00' }
    ]
  },
  '火': {
    enabled: true,
    timeSlots: [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '15:00', endTime: '16:00' }
    ]
  },
  '水': {
    enabled: false,
    timeSlots: []
  },
  '木': {
    enabled: true,
    timeSlots: [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '15:00', endTime: '16:00' }
    ]
  },
  '金': {
    enabled: true,
    timeSlots: [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '15:00', endTime: '16:00' }
    ]
  },
  '土': {
    enabled: true,
    timeSlots: [
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '15:00', endTime: '16:00' }
    ]
  },
  '日': {
    enabled: false,
    timeSlots: []
  }
};

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      date: '2025-01-20',
      timeSlot: '09:00-10:00',
      lastName: '田中',
      firstName: '太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      createdAt: new Date()
    },
    {
      id: '2',
      date: '2025-01-22',
      timeSlot: '13:00-14:00',
      lastName: '佐藤',
      firstName: '花子',
      email: 'sato@example.com',
      createdAt: new Date()
    }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(defaultWeeklySchedule);

  const createBooking = useCallback((date: string, timeSlot: string, formData: BookingFormData) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      date,
      timeSlot,
      ...formData,
      createdAt: new Date()
    };
    
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, []);

  const getDaySchedule = useCallback((date: Date): DaySchedule => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    const dayConfig = weeklySchedule[dayOfWeek];
    
    if (!dayConfig.enabled) {
      return { date: dateStr, timeSlots: [] };
    }

    const timeSlots = dayConfig.timeSlots.map(slot => {
      const slotId = `${dateStr}-${slot.startTime}-${slot.endTime}`;
      const isBooked = bookings.some(booking => 
        booking.date === dateStr && 
        booking.timeSlot === `${slot.startTime}-${slot.endTime}`
      );
      
      return {
        id: slotId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: !isBooked
      };
    });

    return { date: dateStr, timeSlots };
  }, [bookings, weeklySchedule]);

  const updateWeeklySchedule = useCallback((newSchedule: WeeklySchedule) => {
    setWeeklySchedule(newSchedule);
  }, []);

  return {
    bookings,
    weeklySchedule,
    createBooking,
    getDaySchedule,
    updateWeeklySchedule
  };
};