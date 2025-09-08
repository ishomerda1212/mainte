import React, { useState } from 'react';
import { Settings, Plus, Trash2, Clock, ArrowLeft, Save } from 'lucide-react';
import { WeeklySchedule } from '../types/booking';
import { useBookings } from '../hooks/useBookings';

interface AdminScheduleSettingsProps {
  onClose: () => void;
}

export const AdminScheduleSettings: React.FC<AdminScheduleSettingsProps> = ({ onClose }) => {
  const { weeklySchedule, updateWeeklySchedule, bookings } = useBookings();
  const [localSchedule, setLocalSchedule] = useState<WeeklySchedule>(weeklySchedule);

  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];

  const handleDayToggle = (day: string) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const addTimeSlot = (day: string) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [
          ...prev[day].timeSlots,
          { startTime: '09:00', endTime: '10:00' }
        ]
      }
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: 'startTime' | 'endTime', value: string) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleSave = () => {
    updateWeeklySchedule(localSchedule);
    onClose();
  };

  const recentBookings = bookings.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings size={24} className="text-blue-600" />
            予約スケジュール設定
          </h2>
          <p className="text-gray-600 mt-1">
            曜日別の予約可能時間を設定できます
          </p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">最近の予約</h3>
        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.lastName} {booking.firstName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.date} {booking.timeSlot}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {booking.createdAt.toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">まだ予約がありません</p>
        )}
      </div>

      {/* Weekly Schedule Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">曜日別予約枠設定</h3>
        
        <div className="space-y-6">
          {weekDays.map(day => (
            <div key={day} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSchedule[day].enabled}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900">{day}曜日</span>
                  </label>
                </div>
                {localSchedule[day].enabled && (
                  <button
                    onClick={() => addTimeSlot(day)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    時間枠追加
                  </button>
                )}
              </div>

              {localSchedule[day].enabled && (
                <div className="space-y-3">
                  {localSchedule[day].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <Clock size={16} className="text-gray-500" />
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(day, index, 'startTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">〜</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(day, index, 'endTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeTimeSlot(day, index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {localSchedule[day].timeSlots.length === 0 && (
                    <p className="text-gray-500 text-sm italic">時間枠が設定されていません</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save size={18} />
          設定を保存
        </button>
      </div>
    </div>
  );
};