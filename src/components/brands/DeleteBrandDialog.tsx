
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Brand } from '@/hooks/useBrands';

interface DeleteBrandDialogProps {
  brand: Brand | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteBrandDialog: React.FC<DeleteBrandDialogProps> = ({
  brand,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const { t } = useLanguage();

  if (!brand) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {t('deleteBrand')}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {t('deleteBrandConfirmation')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-destructive">
            <p className="font-medium text-foreground">{brand.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {t('deleteWarning')}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-primary/20"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
