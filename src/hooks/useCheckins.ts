
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface CheckinRecord {
  id: number;
  customer_id: number;
  user_id: number;
  shop_photo: string;
  checkin_time: string;
  user_name: string;
  user_phone: string;
  shop_name: string;
  customer_name: string;
  current_user: string;
}

export interface CheckinResponse {
  success: boolean;
  message: string;
  data: {
    checkins: CheckinRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    current_user: string;
  };
}

export const useCheckins = () => {
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const fetchCheckins = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching checkins with User ID:', user.id);
      
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/checkins', {
        method: 'GET',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data: CheckinResponse = await response.json();
      console.log('Checkins API Response:', data);

      if (data.success) {
        setCheckins(data.data.checkins);
      } else {
        setError(data.message || 'Failed to fetch checkins');
      }
    } catch (err) {
      console.error('Error fetching checkins:', err);
      setError('Failed to fetch checkins');
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckin = async (customerId: number, shopPhoto: File): Promise<boolean> => {
    if (!user || !token) return false;

    try {
      console.log('Creating checkin for customer:', customerId);
      
      const formData = new FormData();
      formData.append('customer_id', customerId.toString());
      formData.append('shop_photo', shopPhoto);

      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/checkins', {
        method: 'POST',
        headers: {
          'X-User-ID': user.id.toString(),
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Create checkin API Response:', data);

      if (data.success) {
        // Refresh checkins after successful creation
        await fetchCheckins();
        return true;
      } else {
        console.error('Failed to create checkin:', data.message);
        return false;
      }
    } catch (err) {
      console.error('Error creating checkin:', err);
      return false;
    }
  };

  const deleteCheckin = async (checkinId: number): Promise<boolean> => {
    if (!user || !token) return false;

    try {
      console.log('Deleting checkin with ID:', checkinId);
      
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/checkins/${checkinId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Delete checkin API Response:', data);

      if (data.success) {
        // Refresh checkins after successful deletion
        await fetchCheckins();
        return true;
      } else {
        console.error('Failed to delete checkin:', data.message);
        return false;
      }
    } catch (err) {
      console.error('Error deleting checkin:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, [user, token]);

  return {
    checkins,
    isLoading,
    error,
    fetchCheckins,
    createCheckin,
    deleteCheckin,
  };
};
