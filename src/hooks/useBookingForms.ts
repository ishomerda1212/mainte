import { useState, useCallback } from 'react';
import { BookingFormConfig, BookingFormConfigData } from '../types/booking';

const defaultForms: BookingFormConfig[] = [
  {
    id: '1',
    title: '一般相談',
    description: 'お気軽にご相談ください。どのようなことでもお聞きします。',
    duration: 60,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '2',
    title: '技術サポート',
    description: '技術的な問題やご質問についてサポートいたします。',
    duration: 30,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }
];

export const useBookingForms = () => {
  const [forms, setForms] = useState<BookingFormConfig[]>(defaultForms);

  const createForm = useCallback((formData: BookingFormConfigData) => {
    const newForm: BookingFormConfig = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setForms(prev => [...prev, newForm]);
    return newForm;
  }, []);

  const updateForm = useCallback((id: string, formData: BookingFormConfigData) => {
    setForms(prev => prev.map(form => 
      form.id === id 
        ? { ...form, ...formData, updatedAt: new Date() }
        : form
    ));
  }, []);

  const deleteForm = useCallback((id: string) => {
    setForms(prev => prev.filter(form => form.id !== id));
  }, []);

  const toggleFormStatus = useCallback((id: string) => {
    setForms(prev => prev.map(form => 
      form.id === id 
        ? { ...form, isActive: !form.isActive, updatedAt: new Date() }
        : form
    ));
  }, []);

  const getActiveForm = useCallback(() => {
    return forms.find(form => form.isActive) || forms[0];
  }, [forms]);

  return {
    forms,
    createForm,
    updateForm,
    deleteForm,
    toggleFormStatus,
    getActiveForm
  };
};