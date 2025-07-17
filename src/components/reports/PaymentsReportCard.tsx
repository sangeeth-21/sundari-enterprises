
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePaymentsReport } from '@/hooks/useReports';
import { StatCard } from '@/components/ui/stat-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CreditCard, AlertCircle } from 'lucide-react';

export const PaymentsReportCard: React.FC = () => {
  const { t } = useLanguage();
  const paymentsQuery = usePaymentsReport();

  const formatCurrency = (amount: string) => `₹${parseFloat(amount).toFixed(2)}`;

  if (paymentsQuery.isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <CreditCard className="w-5 h-5" />
            {t('paymentsReport')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-muted-foreground transition-all duration-300">
              {t('loading')}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentsQuery.error) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <CreditCard className="w-5 h-5" />
            {t('paymentsReport')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-destructive">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="transition-all duration-300">{t('failedToLoadReport')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!paymentsQuery.data) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <CreditCard className="w-5 h-5" />
            {t('paymentsReport')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <span className="transition-all duration-300">{t('noDataFound')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { payments, summary } = paymentsQuery.data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map((item, index) => (
          <StatCard
            key={index}
            title={`${t('totalPayments')} (${item.payment_mode})`}
            value={formatCurrency(item.total_payments)}
            icon={CreditCard}
          />
        ))}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <CreditCard className="w-5 h-5" />
            {t('paymentsReport')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px] transition-all duration-300">{t('paymentDate')}</TableHead>
                  <TableHead className="text-right min-w-[100px] transition-all duration-300">{t('amount')}</TableHead>
                  <TableHead className="min-w-[100px] transition-all duration-300">{t('paymentMode')}</TableHead>
                  <TableHead className="min-w-[120px] transition-all duration-300">{t('referenceNumber')}</TableHead>
                  <TableHead className="min-w-[150px] transition-all duration-300">{t('shopName')}</TableHead>
                  <TableHead className="min-w-[150px] transition-all duration-300">{t('ownerName')}</TableHead>
                  <TableHead className="min-w-[120px] transition-all duration-300">{t('receivedBy')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors duration-200">
                    <TableCell>{payment.payment_date}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="capitalize">{payment.payment_mode}</TableCell>
                    <TableCell>{payment.reference_number || '-'}</TableCell>
                    <TableCell>{payment.shop_name}</TableCell>
                    <TableCell>{payment.owner_name}</TableCell>
                    <TableCell>{payment.received_by}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
