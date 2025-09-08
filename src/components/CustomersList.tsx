import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Mail, Phone, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { Customer, CustomerFormData, BookingFormConfig } from '../types/booking';
import { CustomerEditor } from './CustomerEditor';

interface CustomersListProps {
  customers: Customer[];
  selectedForm: BookingFormConfig;
  onCreateCustomer: (customerData: CustomerFormData) => void;
  onUpdateCustomer: (id: string, customerData: CustomerFormData) => void;
  onDeleteCustomer: (id: string) => void;
  onGenerateUrl: (customerId: string, formId: string) => string;
  onBack: () => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({
  customers,
  selectedForm,
  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onGenerateUrl,
  onBack
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingCustomer(null);
    setShowEditor(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditor(true);
  };

  const handleSave = (customerData: CustomerFormData) => {
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, customerData);
    } else {
      onCreateCustomer(customerData);
    }
    setShowEditor(false);
    setEditingCustomer(null);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingCustomer(null);
  };

  const handleCopyUrl = async (customerId: string) => {
    const url = onGenerateUrl(customerId, selectedForm.id);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(customerId);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleOpenUrl = (customerId: string) => {
    const url = onGenerateUrl(customerId, selectedForm.id);
    window.open(url, '_blank');
  };

  if (showEditor) {
    return (
      <CustomerEditor
        customer={editingCustomer}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">顧客管理</h2>
          <p className="text-gray-600 mt-1">
            {selectedForm.title} - 事前登録された顧客情報を管理
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">顧客専用URLについて</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          顧客を登録すると、その顧客専用の予約URLが生成されます。このURLを顧客に送信すると、
          予約フォームに顧客情報が自動入力された状態で表示されます。
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">登録顧客数</p>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          </div>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={18} />
          新しい顧客
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <User size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            登録された顧客がありません
          </h3>
          <p className="text-gray-600 mb-4">
            最初の顧客を登録してください
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            顧客を登録
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {customers.map(customer => (
            <div
              key={customer.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customer.lastName} {customer.firstName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {customer.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} />
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>

                  {customer.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
                      {customer.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>登録: {customer.createdAt.toLocaleDateString('ja-JP')}</span>
                    <span>更新: {customer.updatedAt.toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(customer.id)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                        copiedUrl === customer.id
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      title="URLをコピー"
                    >
                      <Copy size={14} />
                      {copiedUrl === customer.id ? 'コピー済み' : 'URLコピー'}
                    </button>
                    <button
                      onClick={() => handleOpenUrl(customer.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="予約画面を開く"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="編集"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};