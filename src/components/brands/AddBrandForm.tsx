
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, X } from 'lucide-react';

interface AddBrandFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<boolean>;
  onCancel: () => void;
}

export const AddBrandForm: React.FC<AddBrandFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      setFormData({ name: '', description: '' });
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
            {t('addBrand')}
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
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? t('creating') : t('createBrand')}
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
      </CardContent>
    </Card>
  );
};
