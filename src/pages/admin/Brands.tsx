
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AddBrandForm } from '@/components/brands/AddBrandForm';
import { EditBrandForm } from '@/components/brands/EditBrandForm';
import { BrandCard } from '@/components/brands/BrandCard';
import { DeleteBrandDialog } from '@/components/brands/DeleteBrandDialog';
import { useBrands, Brand } from '@/hooks/useBrands';
import { useToast } from '@/hooks/use-toast';
import { 
  Tag, 
  Plus, 
  Search
} from 'lucide-react';

export const Brands: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { 
    brands, 
    isLoading, 
    error, 
    fetchBrands, 
    fetchSingleBrand,
    createBrand, 
    updateBrand,
    deleteBrand 
  } = useBrands();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchBrands(value);
  };

  const handleCreateBrand = async (data: { name: string; description: string }) => {
    const success = await createBrand(data);
    if (success) {
      toast({
        title: t('success'),
        description: t('brandCreatedSuccessfully'),
      });
      setShowAddForm(false);
      return true;
    } else {
      toast({
        title: t('error'),
        description: t('failedToCreateBrand'),
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateBrand = async (data: { name: string; description: string }) => {
    if (!editingBrand) return false;
    
    const success = await updateBrand(editingBrand.id, data);
    if (success) {
      toast({
        title: t('success'),
        description: t('brandUpdatedSuccessfully'),
      });
      setEditingBrand(null);
      return true;
    } else {
      toast({
        title: t('error'),
        description: t('failedToUpdateBrand'),
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteBrand = async () => {
    if (!deletingBrand) return;
    
    setIsDeleting(true);
    const success = await deleteBrand(deletingBrand.id);
    setIsDeleting(false);
    
    if (success) {
      toast({
        title: t('success'),
        description: t('brandDeletedSuccessfully'),
      });
      setDeletingBrand(null);
    } else {
      toast({
        title: t('error'),
        description: t('failedToDeleteBrand'),
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="shadow-card bg-card border-destructive/20">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <Tag className="w-16 h-16 text-destructive mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">{t('error')}</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button 
                onClick={() => fetchBrands(searchTerm)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {t('retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t('brands')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('manageBrands')}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addBrand')}
        </Button>
      </div>

      {/* Add Brand Form */}
      {showAddForm && (
        <AddBrandForm
          onSubmit={handleCreateBrand}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Brand Form */}
      {editingBrand && (
        <EditBrandForm
          brand={editingBrand}
          onSubmit={handleUpdateBrand}
          onCancel={() => setEditingBrand(null)}
          onFetchBrand={fetchSingleBrand}
        />
      )}

      {/* Search */}
      <Card className="shadow-card bg-card border-primary/20">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`${t('search')} ${t('brands')}...`}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="shadow-card bg-card border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="md" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={setEditingBrand}
              onDelete={setDeletingBrand}
            />
          ))
        )}
      </div>

      {brands.length === 0 && !isLoading && (
        <Card className="shadow-card bg-card border-primary/20">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">{t('noBrandsFound')}</h3>
                <p className="text-muted-foreground">
                  {t('tryAdjustingSearch')}
                </p>
              </div>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('addBrand')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Brand Dialog */}
      <DeleteBrandDialog
        brand={deletingBrand}
        isOpen={!!deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDeleteBrand}
        isDeleting={isDeleting}
      />
    </div>
  );
};
