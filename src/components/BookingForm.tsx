import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';
import { BookingFormData, Customer } from '../types/booking';
import { getDayOfWeek } from '../utils/dateUtils';

interface BookingFormProps {
  selectedDate: Date;
  selectedTimeSlot: string;
  prefilledCustomer?: Customer | null;
  onSubmit: (formData: BookingFormData) => void;
  onClose: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTimeSlot,
  prefilledCustomer,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    lastName: prefilledCustomer?.lastName || '',
    firstName: prefilledCustomer?.firstName || '',
    email: prefilledCustomer?.email || '',
    phone: prefilledCustomer?.phone || '',
    secondChoice: '',
    notes: prefilledCustomer?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = '姓を入力してください';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = '名を入力してください';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">予約フォーム</h2>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center sm:text-left">
            <p className="text-blue-900 font-medium">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日（{getDayOfWeek(selectedDate)}）
            </p>
            <p className="text-blue-700">
              {selectedTimeSlot}（GMT+09:00）日本標準時
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {prefilledCustomer && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <span className="font-medium">顧客情報が自動入力されました</span>
                  <br />
                  内容を確認し、必要に応じて修正してください。
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">ご連絡先情報</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓 *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } text-base`}
                placeholder="田中"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名 *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } text-base`}
                placeholder="太郎"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail size={16} />
                メールアドレス *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } text-base`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={16} />
                電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="090-1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar size={16} />
                第2希望日時
              </label>
              <input
                type="text"
                value={formData.secondChoice}
                onChange={(e) => handleInputChange('secondChoice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="例: 1月25日 14:00〜"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MessageSquare size={16} />
                自由記入欄
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                placeholder="ご質問やご要望がございましたら、こちらにご記入ください。"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base min-h-[48px] touch-manipulation"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium text-base min-h-[48px] touch-manipulation"
              >
                予約
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};