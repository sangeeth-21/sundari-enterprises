
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/hooks/useProducts';
import { 
  Edit, 
  Trash2, 
  Package,
  Tag,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();

  const getStockStatus = () => {
    const stock = parseInt(product.remaining_stock);
    if (stock === 0) return { color: 'bg-destructive text-destructive-foreground', text: t('outOfStock') };
    if (stock < 10) return { color: 'bg-warning text-warning-foreground', text: t('lowStock') };
    return { color: 'bg-success text-success-foreground', text: t('inStock') };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] border-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-foreground">
                {product.name}
              </h3>
              <Badge variant="secondary" className={stockStatus.color}>
                {stockStatus.text}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{product.brand_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {product.quantity} {product.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">₹{parseFloat(product.price).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className={`font-medium ${
                  parseInt(product.remaining_stock) === 0 
                    ? 'text-destructive' 
                    : parseInt(product.remaining_stock) < 10 
                    ? 'text-warning' 
                    : 'text-success'
                }`}>
                  {product.remaining_stock} {t('remaining')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-primary/10 border-primary/20"
              onClick={() => onEdit(product)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
