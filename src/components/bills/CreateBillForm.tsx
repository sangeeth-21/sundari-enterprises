
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateBill } from '@/hooks/useBills';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { QuantitySelector } from './QuantitySelector';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Package,
  User,
  Calculator,
} from 'lucide-react';

interface BillItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

interface CreateBillFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateBillForm: React.FC<CreateBillFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [customerId, setCustomerId] = useState<number>(0);
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<BillItem[]>([
    { product_id: 0, quantity: 1, unit_price: 0 }
  ]);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const { customers, isLoading: customersLoading } = useCustomers();
  const { products, isLoading: productsLoading } = useProducts();
  const createBillMutation = useCreateBill();

  const addItem = () => {
    setItems([...items, { product_id: 0, quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof BillItem, value: number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const getProductPrice = (productId: number) => {
    const product = products?.find(p => p.id === productId.toString());
    return product ? parseFloat(product.price) : 0;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = item.unit_price || getProductPrice(item.product_id);
      return sum + (item.quantity * price);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || items.some(item => !item.product_id || !item.quantity)) {
      toast({
        title: t('error'),
        description: t('pleaseFillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    const billData = {
      customer_id: customerId,
      bill_date: billDate,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price || getProductPrice(item.product_id),
      })),
      paid_amount: paidAmount,
    };

    try {
      await createBillMutation.mutateAsync(billData);
      toast({
        title: t('success'),
        description: t('billCreatedSuccessfully'),
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToCreateBill'),
        variant: 'destructive',
      });
    }
  };

  const subtotal = calculateSubtotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Customer Selection */}
      <Card className="shadow-card bg-card border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            {t('customerInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">{t('selectCustomer')}</Label>
              <Select value={customerId.toString()} onValueChange={(value) => setCustomerId(parseInt(value))}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder={t('selectCustomer')} />
                </SelectTrigger>
                <SelectContent className="bg-background border-primary/20 z-50">
                  {customersLoading ? (
                    <SelectItem value="0" disabled>
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        {t('loading')}
                      </div>
                    </SelectItem>
                  ) : (
                    customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.shop_name}</span>
                          <span className="text-xs text-muted-foreground">{customer.owner_name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="billDate">{t('billDate')}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="billDate"
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card className="shadow-card bg-card border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" />
              {t('itemDetails')}
            </CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addItem}
              className="hover:bg-primary/10 border-primary/20 transition-all duration-200 hover-scale"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('addItem')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="p-4 bg-accent/10 rounded-lg border border-primary/10 hover:bg-accent/20 transition-all duration-300 animate-fade-in"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <Label>{t('selectProduct')}</Label>
                  <Select 
                    value={item.product_id.toString()} 
                    onValueChange={(value) => updateItem(index, 'product_id', parseInt(value))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder={t('selectProduct')} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-primary/20 z-50">
                      {productsLoading ? (
                        <SelectItem value="0" disabled>
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            {t('loading')}
                          </div>
                        </SelectItem>
                      ) : (
                        products?.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {product.brand_name} • ₹{product.price}/{product.unit}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t('quantity')}</Label>
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(value) => updateItem(index, 'quantity', value)}
                    min={1}
                    max={999}
                    className="justify-center"
                  />
                </div>
                
                <div>
                  <Label>{t('unitPrice')}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price || getProductPrice(item.product_id)}
                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    placeholder="Auto-filled"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div>
                  <Label>{t('totalAmount')}</Label>
                  <div className="h-10 px-3 bg-accent/20 rounded-md flex items-center font-semibold text-primary transition-all duration-200">
                    ₹{((item.unit_price || getProductPrice(item.product_id)) * item.quantity).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:bg-destructive/10 border-destructive/20 transition-all duration-200 hover-scale"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bill Summary */}
      <Card className="shadow-card bg-primary/5 border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="w-5 h-5 text-primary" />
            {t('billSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Label className="text-sm text-muted-foreground">{t('subtotal')}</Label>
              <div className="text-2xl font-bold text-foreground transition-all duration-300">₹{subtotal.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <Label htmlFor="paidAmount">{t('amountPaid')}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  placeholder={t('enterAmountPaid')}
                  className="pl-10 text-center text-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="text-center">
              <Label className="text-sm text-muted-foreground">{t('pendingAmount')}</Label>
              <div className={`text-2xl font-bold transition-all duration-300 ${
                (subtotal - paidAmount) > 0 ? 'text-warning' : 'text-success'
              }`}>
                ₹{Math.abs(subtotal - paidAmount).toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="hover:bg-accent/50 transition-all duration-200"
          >
            {t('cancel')}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={createBillMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-200 hover-scale"
        >
          {createBillMutation.isPending ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {createBillMutation.isPending ? t('creating') : t('createBill')}
        </Button>
      </div>
    </form>
  );
};
