
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreateStaffData, UpdateStaffData, StaffMember, StaffPermissions } from '@/hooks/useStaff';
import { Loader2, User, Phone, Lock, Settings } from 'lucide-react';

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffData | UpdateStaffData) => Promise<boolean>;
  editingStaff?: StaffMember | null;
  isLoading?: boolean;
}

const initialFormData = {
  name: '',
  phone: '',
  password: '',
  role: 'user',
};

const initialPermissions: StaffPermissions = {
  dashboard: 1,
  bills: 1,
  brand: 0,
  product: 1,
  customer: 1,
  checkin: 0,
  auditlogs: 0,
  reports: 1,
};

export const StaffForm: React.FC<StaffFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingStaff,
  isLoading = false,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [permissions, setPermissions] = useState<StaffPermissions>(initialPermissions);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Fetch single staff data function
  const fetchStaffDetails = async (staffId: string) => {
    if (!user) return null;
    
    try {
      setIsFetchingData(true);
      console.log('Fetching staff details for ID:', staffId);
      
      const response = await fetch(`https://api.specd.in/sundarienterprises/index.php/users/${staffId}`, {
        method: 'GET',
        headers: {
          'X-User-ID': user.id.toString(),
        },
      });

      const data = await response.json();
      console.log('Staff details response:', data);
      
      if (data.success && data.data) {
        return data.data;
      } else {
        console.error('Failed to fetch staff details:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
      return null;
    } finally {
      setIsFetchingData(false);
    }
  };

  // Reset form when dialog opens/closes or when switching between staff members
  useEffect(() => {
    if (!isOpen) {
      // Reset everything when dialog closes
      resetForm();
      return;
    }

    // When dialog opens, load appropriate data
    const loadStaffData = async () => {
      setIsDataLoaded(false);
      
      if (editingStaff) {
        console.log('Loading data for editing staff:', editingStaff.id);
        const singleData = await fetchStaffDetails(editingStaff.id);
        if (singleData) {
          console.log('Setting form data with:', singleData);
          setFormData({
            name: singleData.name || '',
            phone: singleData.phone || '',
            password: '',
            role: singleData.role || 'user',
          });
          setPermissions({
            dashboard: singleData.dashboard || 0,
            bills: singleData.bills || 0,
            brand: singleData.brand || 0,
            product: singleData.product || 0,
            customer: singleData.customer || 0,
            checkin: singleData.checkin || 0,
            auditlogs: singleData.auditlogs || 0,
            reports: singleData.reports || 0,
          });
        }
      } else {
        // For new staff, reset to initial values
        console.log('Resetting form for new staff');
        resetForm();
      }
      
      setIsDataLoaded(true);
    };

    loadStaffData();
  }, [editingStaff?.id, isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = editingStaff 
      ? { name: formData.name, phone: formData.phone, role: formData.role, permissions }
      : { ...formData, permissions };

    const success = await onSubmit(submitData as CreateStaffData | UpdateStaffData);
    if (success) {
      onClose();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPermissions(initialPermissions);
    setIsDataLoaded(false);
  };

  const handlePermissionChange = (key: keyof StaffPermissions, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value ? 1 : 0,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-primary" />
            {editingStaff ? t('editStaff') : t('addStaff')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {editingStaff ? t('updateStaffDetails') : t('addNewStaffMember')}
          </DialogDescription>
        </DialogHeader>

        {(isFetchingData && editingStaff && !isDataLoaded) ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t('loadingStaffDetails')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-4 h-4" />
                  {t('name')} & {t('phone')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t('name')} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('enterStaffName')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t('phone')} *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t('enterPhoneNumber')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {!editingStaff && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        {t('password')} *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={t('enterPassword')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      {t('role')} *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('selectRole')} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="user" className="hover:bg-accent">
                          {t('staffRole')}
                        </SelectItem>
                        <SelectItem value="admin" className="hover:bg-accent">
                          {t('admin')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-4 h-4" />
                  {t('permissions')}
                </CardTitle>
                <CardDescription>
                  {t('configurePermissions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between space-x-2 p-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                      <Label htmlFor={key} className="text-sm font-medium capitalize cursor-pointer">
                        {t(key)}
                      </Label>
                      <Switch
                        id={key}
                        checked={value === 1}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(key as keyof StaffPermissions, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="min-w-[100px]"
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isFetchingData}
                className="min-w-[100px] bg-primary hover:bg-primary/90"
              >
                {(isLoading || isFetchingData) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingStaff ? t('updating') : t('creating')}
                  </>
                ) : (
                  editingStaff ? t('update') : t('create')
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
