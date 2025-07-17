import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomers, Customer, CreateCustomerData, UpdateCustomerData } from '@/hooks/useCustomers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ isOpen, onClose, customer }) => {
  const { t } = useLanguage();
  const { createCustomer, updateCustomer } = useCustomers();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!customer;
  
  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        shop_name: customer.shop_name,
        owner_name: customer.owner_name,
        phone: customer.phone,
        address: customer.address,
      });
    } else {
      setFormData({
        shop_name: '',
        owner_name: '',
        phone: '',
        address: '',
      });
    }
  }, [customer]);

  const handleClose = () => {
    setFormData({
      shop_name: '',
      owner_name: '',
      phone: '',
      address: '',
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isEditing && customer) {
        result = await updateCustomer(customer.id, formData);
      } else {
        result = await createCustomer(formData);
      }

      if (result) {
        toast({
          title: t('success'),
          description: isEditing ? t('customerUpdatedSuccessfully') : t('customerCreatedSuccessfully'),
        });
        handleClose();
      } else {
        toast({
          title: t('error'),
          description: isEditing ? t('failedToUpdateCustomer') : t('failedToCreateCustomer'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: isEditing ? t('failedToUpdateCustomer') : t('failedToCreateCustomer'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateCustomerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('editCustomer') : t('addCustomer')}</DialogTitle>
          <DialogDescription>
            {isEditing ? t('editCustomerDescription') : t('addCustomerDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop_name">{t('shopName')}</Label>
            <Input
              id="shop_name"
              value={formData.shop_name}
              onChange={(e) => handleChange('shop_name', e.target.value)}
              placeholder={t('enterShopName')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner_name">{t('ownerName')}</Label>
            <Input
              id="owner_name"
              value={formData.owner_name}
              onChange={(e) => handleChange('owner_name', e.target.value)}
              placeholder={t('enterOwnerName')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('enterPhoneNumber')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">{t('address')}</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder={t('enterAddress')}
              rows={3}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 flex-1">
              {isLoading ? <LoadingSpinner size="sm" /> : (isEditing ? t('update') : t('create'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};