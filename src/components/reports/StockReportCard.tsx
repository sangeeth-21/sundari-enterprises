
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStockReport } from '@/hooks/useReports';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Package, AlertCircle } from 'lucide-react';

export const StockReportCard: React.FC = () => {
  const { t } = useLanguage();
  const stockQuery = useStockReport();

  const formatCurrency = (amount: string) => `₹${parseFloat(amount).toFixed(2)}`;

  if (stockQuery.isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <Package className="w-5 h-5" />
            {t('stockReport')}
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

  if (stockQuery.error) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <Package className="w-5 h-5" />
            {t('stockReport')}
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

  if (!stockQuery.data || stockQuery.data.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-all duration-300">
            <Package className="w-5 h-5" />
            {t('stockReport')}
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
          <Package className="w-5 h-5" />
          {t('stockReport')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px] transition-all duration-300">{t('productName')}</TableHead>
                <TableHead className="min-w-[100px] transition-all duration-300">{t('remainingStock')}</TableHead>
                <TableHead className="min-w-[80px] transition-all duration-300">{t('unit')}</TableHead>
                <TableHead className="min-w-[100px] transition-all duration-300">{t('price')}</TableHead>
                <TableHead className="min-w-[100px] transition-all duration-300">{t('brand')}</TableHead>
                <TableHead className="text-right min-w-[120px] transition-all duration-300">{t('stockValue')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockQuery.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors duration-200">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.remaining_stock}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{item.brand_name}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.stock_value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
