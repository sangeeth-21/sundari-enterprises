
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface StaffPermissions {
  dashboard: number;
  bills: number;
  brand: number;
  product: number;
  customer: number;
  checkin: number;
  auditlogs: number;
  reports: number;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  user_id: string;
  dashboard: string;
  bills: string;
  brand: string;
  product: string;
  customer: string;
  checkin: string;
  auditlogs: string;
  reports: string;
}

export interface SingleStaffMember {
  id: number;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at?: string;
  user_id: number;
  dashboard: number;
  bills: number;
  brand: number;
  product: number;
  customer: number;
  checkin: number;
  auditlogs: number;
  reports: number;
}

export interface CreateStaffData {
  name: string;
  phone: string;
  password: string;
  role: string;
  permissions: StaffPermissions;
}

export interface UpdateStaffData {
  name: string;
  phone: string;
  role: string;
  permissions: StaffPermissions;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSingle, setIsFetchingSingle] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();

  const fetchStaff = async () => {
    if (!user || !token) {
      console.log('No user or token available for staff fetch');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching staff with User ID:', user.id);
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/users', {
        method: 'GET',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Staff API Response:', data);
      
      if (data.success && data.data) {
        setStaff(data.data || []);
        console.log('Staff data set:', data.data);
      } else {
        console.error('Failed to fetch staff:', data);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch staff members",
          variant: "destructive",
        });
        setStaff([]);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSingleStaff = async (staffId: string): Promise<SingleStaffMember | null> => {
    if (!user || !token) {
      console.log('No user or token available for single staff fetch');
      return null;
    }
    
    setIsFetchingSingle(true);
    try {
      console.log('Fetching single staff with ID:', staffId);
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/users/${staffId}`, {
        method: 'GET',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Single Staff API Response:', data);
      
      if (data.success && data.data) {
        return data.data;
      } else {
        console.error('Failed to fetch single staff:', data);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch staff member details",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch single staff:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff member details",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsFetchingSingle(false);
    }
  };

  const createStaff = async (staffData: CreateStaffData) => {
    if (!user || !token) return false;

    try {
      console.log('Creating staff with data:', staffData);
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
        },
        body: JSON.stringify(staffData),
      });

      const data = await response.json();
      console.log('Create staff response:', data);
      
      if (data.success) {
        await fetchStaff(); // Refresh the list
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create staff member",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to create staff:', error);
      toast({
        title: "Error",
        description: "Failed to create staff member",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStaff = async (id: string, staffData: UpdateStaffData) => {
    if (!user || !token) return false;

    try {
      console.log('Updating staff with ID:', id, 'Data:', staffData);
      
      // Filter out permissions with value 0 to remove them from the request body
      const filteredPermissions: Partial<StaffPermissions> = {};
      Object.entries(staffData.permissions).forEach(([key, value]) => {
        if (value === 1) {
          filteredPermissions[key as keyof StaffPermissions] = value;
        }
      });

      const requestBody = {
        name: staffData.name,
        phone: staffData.phone,
        role: staffData.role,
        permissions: filteredPermissions,
      };

      console.log('Request body for update:', requestBody);

      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Update staff response:', data);
      
      if (data.success) {
        await fetchStaff(); // Refresh the list
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update staff member",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to update staff:', error);
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteStaff = async (id: string) => {
    if (!user || !token) return false;

    try {
      console.log('Deleting staff with ID:', id);
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/users/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Delete staff response:', data);
      
      if (data.success) {
        await fetchStaff(); // Refresh the list
        toast({
          title: "Success",
          description: "Staff member deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete staff member",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to delete staff:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && token) {
      console.log('User and token available, fetching staff...');
      fetchStaff();
    }
  }, [user, token]);

  return {
    staff,
    isLoading,
    isFetchingSingle,
    fetchStaff,
    fetchSingleStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
};
