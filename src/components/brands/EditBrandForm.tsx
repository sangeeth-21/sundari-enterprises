
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Edit, X } from 'lucide-react';
import { Brand } from '@/hooks/useBrands';

interface EditBrandFormProps {
  brand: Brand;
  onSubmit: (data: { name: string; description: string }) => Promise<boolean>;
  onCancel: () => void;
  onFetchBrand: (id: number) => Promise<Brand | null>;
}

export const EditBrandForm: React.FC<EditBrandFormProps> = ({ 
  brand, 
  onSubmit, 
  onCancel, 
  onFetchBrand 
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBrand, setIsLoadingBrand] = useState(true);

  useEffect(() => {
    const loadBrandData = async () => {
      setIsLoadingBrand(true);
      const brandData = await onFetchBrand(brand.id);
      if (brandData) {
        setFormData({
          name: brandData.name,
          description: brandData.description,
        });
      }
      setIsLoadingBrand(false);
    };

    loadBrandData();
  }, [brand.id, onFetchBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      onCancel();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card bg-card border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            <Edit className="w-5 h-5 mr-2 inline" />
            {t('editBrand')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoadingBrand ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2 text-muted-foreground">{t('loadingBrandDetails')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('brandName')} *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={t('enterBrandName')}
                required
                className="border-primary/20 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('description')}
              </label>
              <Input
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={t('enterDescription')}
                className="border-primary/20 focus:border-primary"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={!formData.name.trim() || isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isSubmitting ? t('updating') : t('updateBrand')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="hover:bg-secondary/80 border-primary/20"
              >
                {t('cancel')}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
