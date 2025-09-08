import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, FileText, ToggleLeft, ToggleRight, Calendar, Settings, User, Users } from 'lucide-react';
import { BookingFormConfig, BookingFormConfigData } from '../types/booking';
import { FormEditor } from './FormEditor';
import { useBookings } from '../hooks/useBookings';
import { AdminScheduleSettings } from './AdminScheduleSettings';
import { CustomersList } from './CustomersList';
import { useCustomers } from '../hooks/useCustomers';

interface FormsListProps {
  forms: BookingFormConfig[];
  onCreateForm: (formData: BookingFormConfigData) => void;
  onUpdateForm: (id: string, formData: BookingFormConfigData) => void;
  onDeleteForm: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onSelectForm: (form: BookingFormConfig) => void;
}

export const FormsList: React.FC<FormsListProps> = ({
  forms,
  onCreateForm,
  onUpdateForm,
  onDeleteForm,
  onToggleStatus,
  onSelectForm
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingForm, setEditingForm] = useState<BookingFormConfig | null>(null);
  const [showScheduleSettings, setShowScheduleSettings] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [selectedFormForCustomers, setSelectedFormForCustomers] = useState<BookingFormConfig | null>(null);
  const { bookings } = useBookings();
  const { 
    customers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer, 
    generateCustomerUrl 
  } = useCustomers();

  const handleCreateNew = () => {
    setEditingForm(null);
    setShowEditor(true);
  };

  const handleEdit = (form: BookingFormConfig) => {
    setEditingForm(form);
    setShowEditor(true);
  };

  const handleSave = (formData: BookingFormConfigData) => {
    if (editingForm) {
      onUpdateForm(editingForm.id, formData);
    } else {
      onCreateForm(formData);
    }
    setShowEditor(false);
    setEditingForm(null);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingForm(null);
  };

  const handleShowScheduleSettings = () => {
    setShowScheduleSettings(true);
  };

  const handleCloseScheduleSettings = () => {
    setShowScheduleSettings(false);
  };

  const handleShowCustomers = (form: BookingFormConfig) => {
    setSelectedFormForCustomers(form);
    setShowCustomers(true);
  };

  const handleCloseCustomers = () => {
    setShowCustomers(false);
    setSelectedFormForCustomers(null);
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}時間`;
    }
    return `${hours}時間${remainingMinutes}分`;
  };

  if (showEditor) {
    return (
      <FormEditor
        form={editingForm}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (showScheduleSettings) {
    return (
      <AdminScheduleSettings
        onClose={handleCloseScheduleSettings}
      />
    );
  }

  if (showCustomers && selectedFormForCustomers) {
    return (
      <CustomersList
        customers={customers}
        selectedForm={selectedFormForCustomers}
        onCreateCustomer={createCustomer}
        onUpdateCustomer={updateCustomer}
        onDeleteCustomer={deleteCustomer}
        onGenerateUrl={generateCustomerUrl}
        onBack={handleCloseCustomers}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">総フォーム数</p>
              <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">総予約数</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">登録顧客数</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ToggleRight size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">有効フォーム</p>
              <p className="text-2xl font-bold text-gray-900">{forms.filter(f => f.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">予約フォーム管理</h2>
          <p className="text-gray-600 mt-1">
            複数の予約フォームを作成・管理できます
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShowScheduleSettings}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            <Settings size={18} />
            スケジュール設定
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={18} />
            新しいフォーム
          </button>
        </div>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            フォームがありません
          </h3>
          <p className="text-gray-600 mb-4">
            最初の予約フォームを作成してください
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            フォームを作成
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map(form => (
            <div
              key={form.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {form.title}
                    </h3>
                    <button
                      onClick={() => onToggleStatus(form.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        form.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {form.isActive ? (
                        <>
                          <ToggleRight size={14} />
                          有効
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={14} />
                          無効
                        </>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {form.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatDuration(form.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>作成: {form.createdAt.toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onSelectForm(form)}
                    className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    予約画面へ
                  </button>
                  <button
                    onClick={() => handleShowCustomers(form)}
                    className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <Users size={14} />
                    顧客管理
                  </button>
                  <button
                    onClick={() => handleEdit(form)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="編集"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteForm(form.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};