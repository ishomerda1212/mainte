import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthDays, getDayOfWeek, getMonthName, formatDate } from '../utils/dateUtils';
import { useBookings } from '../hooks/useBookings';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onTimeSlotSelect: (date: Date, timeSlot: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  onTimeSlotSelect
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getDaySchedule } = useBookings();

  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isDateSelectable = (date: Date) => {
    return date >= today;
  };

  const renderDaySchedule = (date: Date) => {
    if (!selectedDate || formatDate(selectedDate) !== formatDate(date)) return null;
    
    const daySchedule = getDaySchedule(date);
    
    if (daySchedule.timeSlots.length === 0) {
      return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-center">この日は予約を受け付けておりません</p>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日（{getDayOfWeek(selectedDate)}）の予約時間
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {daySchedule.timeSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => slot.isAvailable && onTimeSlotSelect(date, `${slot.startTime}-${slot.endTime}`)}
              disabled={!slot.isAvailable}
              className={`
                px-3 py-4 rounded-lg border-2 transition-all duration-200 font-medium text-base min-h-[48px] touch-manipulation
                ${slot.isAvailable 
                  ? 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-50 active:scale-95' 
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {slot.startTime}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon size={20} className="text-blue-600" />
            {currentDate.getFullYear()}年{getMonthName(currentDate.getMonth())}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(date => {
            const isToday = formatDate(date) === formatDate(today);
            const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);
            const isSelectable = isDateSelectable(date);
            const daySchedule = getDaySchedule(date);
            const hasAvailableSlots = daySchedule.timeSlots.some(slot => slot.isAvailable);

            return (
              <button
                key={date.getDate()}
                onClick={() => isSelectable && onDateSelect(date)}
                disabled={!isSelectable}
                className={`
                  relative p-2 text-center rounded-lg transition-all duration-200 h-12 text-sm font-medium min-h-[44px] touch-manipulation
                  ${isSelected 
                    ? 'bg-blue-600 text-white shadow-md scale-105' 
                    : isToday
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : isSelectable && hasAvailableSlots
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {date.getDate()}
                {isSelectable && hasAvailableSlots && !isSelected && (
                  <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && renderDaySchedule(selectedDate)}
      </div>
    </div>
  );
};