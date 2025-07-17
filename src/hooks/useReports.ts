
import { useQuery } from '@tanstack/react-query';

export interface StockItem {
  id: string;
  name: string;
  remaining_stock: string;
  unit: string;
  price: string;
  brand_name: string;
  stock_value: string;
}

export interface CustomerBalance {
  id: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  balance: string;
  paid_amount: string;
  pending_amount: string;
}

export interface SalesItem {
  bill_date: string;
  bill_number: string;
  shop_name: string;
  total_amount: string;
  paid_amount: string;
  pending_amount: string;
  created_by: string;
}

export interface SalesData {
  from_date: string;
  to_date: string;
  sales: SalesItem[];
  summary: {
    total_sales: string;
    total_paid: string;
    total_pending: string;
  };
}

export interface PaymentItem {
  payment_date: string;
  amount: string;
  payment_mode: string;
  reference_number: string | null;
  shop_name: string;
  owner_name: string;
  received_by: string;
}

export interface PaymentsData {
  from_date: string;
  to_date: string;
  payments: PaymentItem[];
  summary: Array<{
    total_payments: string;
    payment_mode: string;
    count: number;
  }>;
}

const API_BASE = 'https://api.specd.in/sundarienterprises/index.php';

const fetchReportData = async (type: string) => {
  const response = await fetch(`${API_BASE}/reports?type=${type}`, {
    headers: {
      'X-User-ID': '1',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} report`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || `Failed to load ${type} report`);
  }
  
  return result.data;
};

export const useStockReport = () => {
  return useQuery({
    queryKey: ['reports', 'stock'],
    queryFn: () => fetchReportData('stock') as Promise<StockItem[]>,
  });
};

export const useCustomerBalanceReport = () => {
  return useQuery({
    queryKey: ['reports', 'customer_balance'],
    queryFn: () => fetchReportData('customer_balance') as Promise<CustomerBalance[]>,
  });
};

export const useSalesReport = () => {
  return useQuery({
    queryKey: ['reports', 'sales'],
    queryFn: () => fetchReportData('sales') as Promise<SalesData>,
  });
};

export const usePaymentsReport = () => {
  return useQuery({
    queryKey: ['reports', 'payments'],
    queryFn: () => fetchReportData('payments') as Promise<PaymentsData>,
  });
};
