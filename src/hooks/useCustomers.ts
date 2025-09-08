import { useState, useCallback } from 'react';
import { Customer, CustomerFormData } from '../types/booking';

const defaultCustomers: Customer[] = [
  {
    id: 'cust_001',
    lastName: '田中',
    firstName: '太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    notes: 'VIPカスタマー',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 'cust_002',
    lastName: '佐藤',
    firstName: '花子',
    email: 'sato@example.com',
    phone: '080-9876-5432',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  }
];

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);

  const createCustomer = useCallback((customerData: CustomerFormData) => {
    const newCustomer: Customer = {
      id: `cust_${Date.now().toString().slice(-6)}`,
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((id: string, customerData: CustomerFormData) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id 
        ? { ...customer, ...customerData, updatedAt: new Date() }
        : customer
    ));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  }, []);

  const getCustomerById = useCallback((id: string): Customer | null => {
    return customers.find(customer => customer.id === id) || null;
  }, [customers]);

  const generateCustomerUrl = useCallback((customerId: string, formId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?customerId=${customerId}&formId=${formId}`;
  }, []);

  return {
    customers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    generateCustomerUrl
  };
};