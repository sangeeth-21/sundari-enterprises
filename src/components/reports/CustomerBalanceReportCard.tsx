
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomerBalanceReport } from '@/hooks/useReports';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, AlertCircle } from 'lucide-react';

export const CustomerBalanceReportCard: React.FC = () => {
  const { t } = useLanguage();
  const customerBalanceQuery = useCustomerBalanceReport();

  const formatCurrency = (amount: string) => `₹${parseFloat(amount).toFixed(2)}`;

  if (customerBalanceQuery.isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <Users className="w-5 h-5" />
            {t('customerBalanceReport')}
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

  if (customerBalanceQuery.error) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <Users className="w-5 h-5" />
            {t('customerBalanceReport')}
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

  if (!customerBalanceQuery.data || customerBalanceQuery.data.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <Users className="w-5 h-5" />
            {t('customerBalanceReport')}
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

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 transition-all duration-300">
          <Users className="w-5 h-5" />
          {t('customerBalanceReport')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px] transition-all duration-300">{t('shopName')}</TableHead>
                <TableHead className="min-w-[150px] transition-all duration-300">{t('ownerName')}</TableHead>
                <TableHead className="min-w-[120px] transition-all duration-300">{t('phone')}</TableHead>
                <TableHead className="text-right min-w-[100px] transition-all duration-300">{t('balance')}</TableHead>
                <TableHead className="text-right min-w-[120px] transition-all duration-300">{t('paidAmount')}</TableHead>
                <TableHead className="text-right min-w-[120px] transition-all duration-300">{t('pendingAmount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerBalanceQuery.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors duration-200">
                  <TableCell className="font-medium">{item.shop_name}</TableCell>
                  <TableCell>{item.owner_name}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.balance)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.paid_amount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.pending_amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
