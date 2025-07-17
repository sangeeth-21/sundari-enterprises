import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Customer {
  id: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  address: string;
  balance: string;
  paid_amount: string;
  pending_amount: string;
  created_at: string;
  updated_at: string;
  bills?: any[];
  payments?: any[];
}

export interface CreateCustomerData {
  shop_name: string;
  owner_name: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerData {
  shop_name?: string;
  owner_name?: string;
  phone?: string;
  address?: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchCustomers = async () => {
    if (!user || !token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/customers', {
        method: 'GET',
        headers: {
          'X-User-ID': token,
        },
      });

      const result = await response.json();
      console.log('Customers API response:', result);

      if (result.success) {
        setCustomers(result.data);
      } else {
        console.error('Failed to fetch customers:', result.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomerData) => {
    if (!user || !token) return null;

    try {
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': token,
        },
        body: JSON.stringify(customerData),
      });

      const result = await response.json();
      console.log('Create customer API response:', result);

      if (result.success) {
        await fetchCustomers(); // Refresh the list
        return result.data;
      } else {
        console.error('Failed to create customer:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  };

  const fetchCustomer = async (id: string) => {
    if (!user || !token) return null;

    try {
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/customers/${id}`, {
        method: 'GET',
        headers: {
          'X-User-ID': token,
        },
      });

      const result = await response.json();
      console.log('Single customer API response:', result);

      if (result.success) {
        return result.data;
      } else {
        console.error('Failed to fetch customer:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchCustomers();
    }
  }, [user, token]);

  const updateCustomer = async (id: string, customerData: UpdateCustomerData) => {
    if (!user || !token) return null;

    try {
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': token,
        },
        body: JSON.stringify(customerData),
      });

      const result = await response.json();
      console.log('Update customer API response:', result);

      if (result.success) {
        await fetchCustomers(); // Refresh the list
        return result.data;
      } else {
        console.error('Failed to update customer:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!user || !token) return false;

    try {
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': token,
        },
      });

      const result = await response.json();
      console.log('Delete customer API response:', result);

      if (result.success) {
        await fetchCustomers(); // Refresh the list
        return true;
      } else {
        console.error('Failed to delete customer:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  };

  return {
    customers,
    isLoading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomer,
  };
};