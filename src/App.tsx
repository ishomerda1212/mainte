import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, FileText } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { BookingForm } from './components/BookingForm';
import { SuccessModal } from './components/SuccessModal';
import { FormsList } from './components/FormsList';
import { useBookings } from './hooks/useBookings';
import { useBookingForms } from './hooks/useBookingForms';
import { useCustomers } from './hooks/useCustomers';
import { BookingFormData, Booking, BookingFormConfig } from './types/booking';
import { formatDate } from './utils/dateUtils';

function App() {
  const [currentView, setCurrentView] = useState<'forms' | 'calendar'>('forms');
  const [selectedForm, setSelectedForm] = useState<BookingFormConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  
  const { createBooking } = useBookings();
  const { 
    forms, 
    createForm, 
    updateForm, 
    deleteForm, 
    toggleFormStatus 
  } = useBookingForms();
  const { getCustomerById } = useCustomers();

  // URL parameters for customer prefill
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get('customerId');
  const formIdFromUrl = urlParams.get('formId');
  const prefilledCustomer = customerId ? getCustomerById(customerId) : null;

  // Auto-select form if specified in URL
  React.useEffect(() => {
    if (formIdFromUrl && !selectedForm) {
      const form = forms.find(f => f.id === formIdFromUrl);
      if (form) {
        setSelectedForm(form);
        setCurrentView('calendar');
      }
    }
  }, [formIdFromUrl, forms, selectedForm]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (date: Date, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (formData: BookingFormData) => {
    if (selectedDate && selectedTimeSlot) {
      const booking = createBooking(formatDate(selectedDate), selectedTimeSlot, formData);
      setCompletedBooking(booking);
      setShowBookingForm(false);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    }
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleSelectForm = (form: BookingFormConfig) => {
    setSelectedForm(form);
    setCurrentView('calendar');
  };

  const handleBackToForms = () => {
    setCurrentView('forms');
    setSelectedForm(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const renderHeader = () => {
    switch (currentView) {
      case 'forms':
        return (
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">予約フォーム管理</h1>
          </div>
        );
      case 'calendar':
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToForms}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <CalendarIcon size={24} className="text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedForm?.title || '予約スケジュール'}
              </h1>
              {selectedForm && (
                <p className="text-sm text-gray-600">{selectedForm.description}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {renderHeader()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {currentView === 'forms' && (
          <FormsList
            forms={forms}
            onCreateForm={createForm}
            onUpdateForm={updateForm}
            onDeleteForm={deleteForm}
            onToggleStatus={toggleFormStatus}
            onSelectForm={handleSelectForm}
          />
        )}

        {currentView === 'calendar' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">予約時間を選択</h2>
              <p className="text-sm sm:text-base text-gray-600">
                ご希望の日付を選択し、利用可能な時間枠からお選びください。
              </p>
            </div>

            <div className="grid lg:grid-cols-1 gap-8">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            </div>
          </>
        )}
      </div>

      {showBookingForm && selectedDate && selectedTimeSlot && (
        <BookingForm
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          prefilledCustomer={prefilledCustomer}
          onSubmit={handleBookingSubmit}
          onClose={handleCloseBookingForm}
        />
      )}

      {completedBooking && (
        <SuccessModal
          booking={completedBooking}
          onClose={() => setCompletedBooking(null)}
        />
      )}
    </div>
  );
}

export default App;