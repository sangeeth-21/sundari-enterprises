
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateBillForm } from './CreateBillForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { Receipt } from 'lucide-react';

interface CreateBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBillDialog: React.FC<CreateBillDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="w-6 h-6 text-primary" />
            {t('createNewBill')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('billCreationDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateBillForm 
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
