
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RecordPaymentForm } from './RecordPaymentForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard } from 'lucide-react';

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill?: {
    id: string;
    bill_number: string;
    pending_amount: string;
  } | null;
}

export const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  isOpen,
  onClose,
  bill,
}) => {
  const { t } = useLanguage();

  const handleSuccess = () => {
    onClose();
  };

  if (!bill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="w-6 h-6 text-success" />
            {t('recordPayment')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('recordPaymentDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <RecordPaymentForm 
            billId={bill.id}
            billNumber={bill.bill_number}
            pendingAmount={parseFloat(bill.pending_amount)}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
