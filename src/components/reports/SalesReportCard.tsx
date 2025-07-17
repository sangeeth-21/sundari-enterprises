
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSalesReport } from '@/hooks/useReports';
import { StatCard } from '@/components/ui/stat-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

export const SalesReportCard: React.FC = () => {
  const { t } = useLanguage();
  const salesQuery = useSalesReport();

  const formatCurrency = (amount: string) => `₹${parseFloat(amount).toFixed(2)}`;

  if (salesQuery.isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <TrendingUp className="w-5 h-5" />
            {t('salesReport')}
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

  if (salesQuery.error) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <TrendingUp className="w-5 h-5" />
            {t('salesReport')}
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

  if (!salesQuery.data) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <TrendingUp className="w-5 h-5" />
            {t('salesReport')}
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

  const { sales, summary } = salesQuery.data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t('totalSales')}
          value={formatCurrency(summary.total_sales)}
          icon={TrendingUp}
        />
        <StatCard
          title={t('totalPaid')}
          value={formatCurrency(summary.total_paid)}
          icon={CreditCard}
        />
        <StatCard
          title={t('totalPending')}
          value={formatCurrency(summary.total_pending)}
          icon={AlertCircle}
        />
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <TrendingUp className="w-5 h-5" />
            {t('salesReport')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px] transition-all duration-300">{t('billDate')}</TableHead>
                  <TableHead className="min-w-[150px] transition-all duration-300">{t('billNumber')}</TableHead>
                  <TableHead className="min-w-[150px] transition-all duration-300">{t('shopName')}</TableHead>
                  <TableHead className="text-right min-w-[120px] transition-all duration-300">{t('totalAmount')}</TableHead>
                  <TableHead className="text-right min-w-[120px] transition-all duration-300">{t('paidAmount')}</TableHead>
                  <TableHead className="text-right min-w-[120px] transition-all duration-300">{t('pendingAmount')}</TableHead>
                  <TableHead className="min-w-[100px] transition-all duration-300">{t('createdBy')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors duration-200">
                    <TableCell>{sale.bill_date}</TableCell>
                    <TableCell className="font-medium">{sale.bill_number}</TableCell>
                    <TableCell>{sale.shop_name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.total_amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.paid_amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.pending_amount)}</TableCell>
                    <TableCell>{sale.created_by}</TableCell>
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
