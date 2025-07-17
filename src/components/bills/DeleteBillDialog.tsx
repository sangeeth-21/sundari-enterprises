
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDeleteBill } from '@/hooks/useBills';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Trash2 } from 'lucide-react';

interface DeleteBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: {
    id: string;
    bill_number: string;
  } | null;
}

export const DeleteBillDialog: React.FC<DeleteBillDialogProps> = ({
  isOpen,
  onClose,
  bill,
}) => {
  const { t } = useLanguage();
  const deleteBillMutation = useDeleteBill();

  const handleDelete = async () => {
    if (!bill) return;

    try {
      await deleteBillMutation.mutateAsync(bill.id);
      toast({
        title: t('success'),
        description: t('billDeletedSuccessfully'),
      });
      onClose();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToDeleteBill'),
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            {t('deleteBill')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {t('deleteBillConfirmation')} {bill?.bill_number || ''}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            disabled={deleteBillMutation.isPending}
            className="hover:bg-accent/50"
          >
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBillMutation.isPending}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {deleteBillMutation.isPending ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {deleteBillMutation.isPending ? t('deleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
