
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
import { CheckinRecord } from '@/hooks/useCheckins';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteCheckinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkin: CheckinRecord | null;
  onConfirm: (checkinId: number) => void;
  isDeleting: boolean;
}

export const DeleteCheckinDialog: React.FC<DeleteCheckinDialogProps> = ({
  open,
  onOpenChange,
  checkin,
  onConfirm,
  isDeleting,
}) => {
  const { t } = useLanguage();

  if (!checkin) return null;

  const handleConfirm = () => {
    onConfirm(checkin.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {t('deleteCheckin')}
          </DialogTitle>
          <DialogDescription className="text-left">
            {t('deleteCheckinConfirmation')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">{t('shop')}:</span> {checkin.shop_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t('customer')}:</span> {checkin.customer_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t('checkinBy')}:</span> {checkin.user_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t('time')}:</span> {new Date(checkin.checkin_time).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            disabled={isDeleting}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin mr-2" />
                {t('deleting')}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {t('delete')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
