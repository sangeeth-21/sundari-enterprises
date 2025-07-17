
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export interface RecordPaymentData {
  billId: string;
  payment_amount: number;
  payment_date: string;
  payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  reference_number?: string;
}

const API_BASE = 'https://api.specd.in/sundarienterprises/index.php';

export const useRecordPayment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ billId, ...paymentData }: RecordPaymentData) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch(`${API_BASE}/bills/${billId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to record payment');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to record payment');
      }
      
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};
