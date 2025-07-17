
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBill } from '@/hooks/useBills';
import {
  Receipt,
  Calendar,
  User,
  Phone,
  MapPin,
  Package,
  DollarSign,
  CreditCard,
  Clock,
} from 'lucide-react';

interface BillDetailsDialogProps {
  billId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BillDetailsDialog: React.FC<BillDetailsDialogProps> = ({
  billId,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const { data: bill, isLoading, error } = useBill(billId || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {bill?.bill_number || t('billDetails')}
          </DialogTitle>
          <DialogDescription>
            {t('viewBillDetails')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{t('failedToLoadBillDetails')}</p>
            </div>
          ) : bill ? (
            <div className="space-y-6">
              {/* Bill Header */}
              <div className="bg-accent/20 rounded-lg p-4 border border-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {bill.bill_number}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(bill.bill_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(bill.payment_status)}
                  >
                    {t(bill.payment_status)}
                  </Badge>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-card rounded-lg p-4 border border-primary/10">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {t('customerInformation')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('shopName')}</p>
                    <p className="font-medium text-foreground">{bill.shop_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('ownerName')}</p>
                    <p className="font-medium text-foreground">{bill.owner_name}</p>
                  </div>
                  {bill.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{bill.phone}</span>
                    </div>
                  )}
                  {bill.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-foreground text-sm">{bill.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Items */}
              {bill.items && bill.items.length > 0 && (
                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    {t('billItems')}
                  </h4>
                  <div className="space-y-3">
                    {bill.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-accent/10 rounded-lg border border-primary/5"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.brand_name} • {item.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          <div className="text-sm">
                            <span className="text-muted-foreground">{t('quantity')}: </span>
                            <span className="font-medium text-foreground">{item.quantity}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">{t('unitPrice')}: </span>
                            <span className="font-medium text-foreground">₹{item.unit_price}</span>
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            ₹{item.total_price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {t('paymentSummary')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('totalAmount')}</span>
                    </div>
                    <p className="text-xl font-semibold text-foreground">₹{bill.total_amount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('paidAmount')}</span>
                    </div>
                    <p className="text-xl font-semibold text-success">₹{bill.paid_amount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('pendingAmount')}</span>
                    </div>
                    <p className={`text-xl font-semibold ${
                      parseFloat(bill.pending_amount) > 0 ? 'text-warning' : 'text-success'
                    }`}>
                      ₹{bill.pending_amount}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamps */}
              <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground bg-accent/10 rounded-lg p-3">
                <div>
                  <span>{t('createdAt')}: </span>
                  <span>{new Date(bill.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span>{t('updatedAt')}: </span>
                  <span>{new Date(bill.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
