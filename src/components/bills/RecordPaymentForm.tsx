
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRecordPayment } from '@/hooks/usePayments';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Hash,
  Receipt,
} from 'lucide-react';

interface RecordPaymentFormProps {
  billId: string;
  billNumber: string;
  pendingAmount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RecordPaymentForm: React.FC<RecordPaymentFormProps> = ({
  billId,
  billNumber,
  pendingAmount,
  onSuccess,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [paymentAmount, setPaymentAmount] = useState<number>(pendingAmount);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<string>('cash');
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  const recordPaymentMutation = useRecordPayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: t('error'),
        description: t('pleaseEnterValidAmount'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        billId,
        payment_amount: paymentAmount,
        payment_date: paymentDate,
        payment_mode: paymentMode as any,
        reference_number: referenceNumber || undefined,
      });
      
      toast({
        title: t('success'),
        description: t('paymentRecordedSuccessfully'),
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToRecordPayment'),
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Bill Information */}
      <Card className="shadow-card bg-primary/5 border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5 text-primary" />
            {t('billInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">{t('billNumber')}</Label>
              <div className="font-semibold text-foreground">{billNumber}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{t('pendingAmount')}</Label>
              <div className="font-semibold text-warning">₹{pendingAmount.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="shadow-card bg-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5 text-primary" />
            {t('paymentDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentAmount">{t('paymentAmount')}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={pendingAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="pl-10 text-lg font-semibold"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="paymentDate">{t('paymentDate')}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMode">{t('paymentMode')}</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectPaymentMode')} />
                </SelectTrigger>
                <SelectContent className="bg-background border-primary/20">
                  <SelectItem value="cash">{t('cash')}</SelectItem>
                  <SelectItem value="card">{t('card')}</SelectItem>
                  <SelectItem value="upi">{t('upi')}</SelectItem>
                  <SelectItem value="bank_transfer">{t('bankTransfer')}</SelectItem>
                  <SelectItem value="cheque">{t('cheque')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="referenceNumber">{t('referenceNumber')} ({t('optional')})</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="referenceNumber"
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder={t('enterReferenceNumber')}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="hover:bg-accent/50"
          >
            {t('cancel')}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={recordPaymentMutation.isPending}
          className="bg-success hover:bg-success/90 text-success-foreground shadow-lg"
        >
          {recordPaymentMutation.isPending ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          {recordPaymentMutation.isPending ? t('recording') : t('recordPayment')}
        </Button>
      </div>
    </form>
  );
};
