
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, Product } from '@/hooks/useProducts';
import { useBrands } from '@/hooks/useBrands';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onOpenChange,
  editingProduct,
}) => {
  const { t } = useLanguage();
  const { createProduct, updateProduct, isCreating, isUpdating } = useProducts();
  const { brands } = useBrands();
  
  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    description: '',
    quantity: '',
    unit: '',
    price: '',
    initial_stock: '',
  });

  useEffect(() => {
    if (editingProduct && open) {
      setFormData({
        brand_id: editingProduct.brand_id,
        name: editingProduct.name,
        description: editingProduct.description,
        quantity: editingProduct.quantity,
        unit: editingProduct.unit,
        price: editingProduct.price,
        initial_stock: editingProduct.remaining_stock,
      });
    } else if (!editingProduct && open) {
      setFormData({
        brand_id: '',
        name: '',
        description: '',
        quantity: '',
        unit: '',
        price: '',
        initial_stock: '',
      });
    }
  }, [editingProduct, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct({
        id: editingProduct.id,
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
      });
    } else {
      createProduct({
        brand_id: parseInt(formData.brand_id),
        name: formData.name,
        description: formData.description,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        initial_stock: parseInt(formData.initial_stock),
      });
    }
    
    onOpenChange(false);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? t('editProduct') : t('addProduct')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingProduct && (
            <div className="space-y-2">
              <Label htmlFor="brand_id">{t('brand')}</Label>
              <Select 
                value={formData.brand_id} 
                onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectBrand')} />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t('productName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {!editingProduct && (
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('quantity')}</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">{t('unit')}</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder={t('unitPlaceholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t('price')}</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          {!editingProduct && (
            <div className="space-y-2">
              <Label htmlFor="initial_stock">{t('initialStock')}</Label>
              <Input
                id="initial_stock"
                type="number"
                value={formData.initial_stock}
                onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              {editingProduct ? t('update') : t('create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
