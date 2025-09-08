import React from 'react';
import { CheckCircle, X, Calendar, Clock, User, Mail } from 'lucide-react';
import { Booking } from '../types/booking';
import { getDayOfWeek } from '../utils/dateUtils';

interface SuccessModalProps {
  booking: Booking;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ booking, onClose }) => {
  const bookingDate = new Date(booking.date);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">予約完了</h2>
                <p className="text-gray-600">ご予約ありがとうございます</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-blue-600" />
                <span className="font-medium text-blue-900">予約日時</span>
              </div>
              <p className="text-blue-800">
                {bookingDate.getMonth() + 1}月{bookingDate.getDate()}日（{getDayOfWeek(bookingDate)}）
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={16} className="text-blue-600" />
                <span className="text-blue-700">{booking.timeSlot}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-gray-600" />
                <span className="font-medium text-gray-900">予約者情報</span>
              </div>
              <p className="text-gray-800 mb-1">
                {booking.lastName} {booking.firstName}
              </p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-600" />
                <span className="text-gray-700">{booking.email}</span>
              </div>
            </div>

            {booking.secondChoice && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">第2希望: </span>
                  {booking.secondChoice}
                </p>
              </div>
            )}

            {booking.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">備考: </span>
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 leading-relaxed">
              確認メールを{booking.email}宛に送信いたします。
              予約の変更・キャンセルをご希望の場合は、お手数ですが直接お問い合わせください。
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium text-base min-h-[48px] touch-manipulation"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};