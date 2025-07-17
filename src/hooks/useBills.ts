
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export interface BillItem {
  id: number;
  bill_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  product_name: string;
  unit: string;
  brand_name: string;
}

export interface Bill {
  id: string;
  bill_number: string;
  customer_id: string;
  bill_date: string;
  total_amount: string;
  paid_amount: string;
  pending_amount: string;
  payment_status: 'paid' | 'pending' | 'overdue';
  created_by: string;
  created_at: string;
  updated_at: string;
  shop_name: string;
  owner_name: string;
  phone?: string;
  address?: string;
  items?: BillItem[];
}

export interface CreateBillData {
  customer_id: number;
  bill_date: string;
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
  paid_amount: number;
}

const API_BASE = 'https://api.specd.in/sundarienterprises/index.php';

export const useBills = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bills'],
    queryFn: async (): Promise<Bill[]> => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_BASE}/bills`, {
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch bills');
      }
      
      return data.data;
    },
    enabled: !!user,
  });
};

export const useBill = (billId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bill', billId],
    queryFn: async (): Promise<Bill> => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_BASE}/bills/${billId}`, {
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bill');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch bill');
      }
      
      return data.data;
    },
    enabled: !!user && !!billId,
  });
};

export const useCreateBill = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (billData: CreateBillData) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
        },
        body: JSON.stringify(billData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create bill');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create bill');
      }
      
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useDeleteBill = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (billId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_BASE}/bills/${billId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete bill');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete bill');
      }
      
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};
