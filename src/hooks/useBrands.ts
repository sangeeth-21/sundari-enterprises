
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Brand {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandData {
  name: string;
  description: string;
}

export interface UpdateBrandData {
  name: string;
  description: string;
}

export const useBrands = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async (search: string = '') => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const url = `https://api.specd.in/sundarienterprises/index.php/brands${search ? `?search=${encodeURIComponent(search)}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Brands API response:', data);
      
      if (data.success) {
        setBrands(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch brands');
      }
    } catch (err) {
      setError('Failed to fetch brands');
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSingleBrand = async (id: number): Promise<Brand | null> => {
    if (!user) return null;

    try {
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/brands/${id}`, {
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Single brand API response:', data);
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message || 'Failed to fetch brand');
        return null;
      }
    } catch (err) {
      setError('Failed to fetch brand');
      console.error('Error fetching brand:', err);
      return null;
    }
  };

  const createBrand = async (brandData: CreateBrandData): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Creating brand with data:', brandData);
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
        },
        body: JSON.stringify(brandData),
      });

      const data = await response.json();
      console.log('Create brand API response:', data);
      
      if (data.success) {
        // Refresh the brands list
        await fetchBrands();
        return true;
      } else {
        setError(data.message || 'Failed to create brand');
        return false;
      }
    } catch (err) {
      setError('Failed to create brand');
      console.error('Error creating brand:', err);
      return false;
    }
  };

  const updateBrand = async (id: number, brandData: UpdateBrandData): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Updating brand with ID:', id, 'Data:', brandData);
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
        },
        body: JSON.stringify(brandData),
      });

      const data = await response.json();
      console.log('Update brand API response:', data);
      
      if (data.success) {
        // Refresh the brands list
        await fetchBrands();
        return true;
      } else {
        setError(data.message || 'Failed to update brand');
        return false;
      }
    } catch (err) {
      setError('Failed to update brand');
      console.error('Error updating brand:', err);
      return false;
    }
  };

  const deleteBrand = async (id: number): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Deleting brand with ID:', id);
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/brands/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Delete brand API response:', data);
      
      if (data.success) {
        // Refresh the brands list
        await fetchBrands();
        return true;
      } else {
        setError(data.message || 'Failed to delete brand');
        return false;
      }
    } catch (err) {
      setError('Failed to delete brand');
      console.error('Error deleting brand:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [user]);

  return {
    brands,
    isLoading,
    error,
    fetchBrands,
    fetchSingleBrand,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};
