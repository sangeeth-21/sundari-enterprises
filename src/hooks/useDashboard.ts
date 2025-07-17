
import { useQuery } from '@tanstack/react-query';

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    sales: {
      today: { count: number; total: string; paid: string; pending: string };
      month: { count: number; total: string; paid: string; pending: string };
      year: { count: number; total: string; paid: string; pending: string };
    };
    profit: {
      today: number;
      month: number;
      year: number;
    };
    pending: {
      customers: string;
      bills: string;
    };
    customers: {
      total: string;
      with_pending: string;
    };
    products: {
      total: string;
      low_stock: string;
      out_of_stock: string;
    };
    recent_bills: Array<{
      id: string;
      bill_number: string;
      shop_name: string;
      total_amount: string;
      payment_status: string;
    }>;
    recent_payments: Array<{
      amount: string;
      payment_date: string;
      shop_name: string;
      payment_mode: string;
    }>;
    recent_checkins: Array<{
      checkin_time: string;
      staff_name: string;
      shop_name: string;
    }>;
    inventory_value: string;
    top_products: Array<{
      name: string;
      total_sold: string;
    }>;
    top_customers: Array<{
      shop_name: string;
      total_purchases: string;
    }>;
  };
}

const fetchDashboardData = async (): Promise<DashboardResponse> => {
  const response = await fetch('https://api.specd.in/sundarienterprises/index.php/dashboard', {
    method: 'GET',
    headers: {
      'X-User-ID': '1',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};
