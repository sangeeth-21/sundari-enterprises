
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Tag, 
  Edit,
  Trash2,
  Building,
  Calendar
} from 'lucide-react';
import { Brand } from '@/hooks/useBrands';

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, onEdit, onDelete }) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card 
      className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] bg-card border-primary/20"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
            <Tag className="w-6 h-6 text-primary-foreground" />
          </div>
          <Badge className="bg-success text-success-foreground">
            {t('active')}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          {brand.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {brand.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              ID: {brand.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(brand.created_at)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary/10 border-primary/20"
            onClick={() => onEdit(brand)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {t('edit')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            onClick={() => onDelete(brand)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
