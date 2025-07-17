
import React, { useState } from 'react';
import { ReportHeader } from '@/components/reports/ReportHeader';
import { StockReportCard } from '@/components/reports/StockReportCard';
import { CustomerBalanceReportCard } from '@/components/reports/CustomerBalanceReportCard';
import { SalesReportCard } from '@/components/reports/SalesReportCard';
import { PaymentsReportCard } from '@/components/reports/PaymentsReportCard';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Users, TrendingUp, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Reports: React.FC = () => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportBoxes = [
    {
      id: 'stock',
      title: t('stockReport'),
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      component: <StockReportCard />
    },
    {
      id: 'customers',
      title: t('customerBalanceReport'),
      icon: Users,
      color: 'from-green-500 to-green-600',
      component: <CustomerBalanceReportCard />
    },
    {
      id: 'sales',
      title: t('salesReport'),
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      component: <SalesReportCard />
    },
    {
      id: 'payments',
      title: t('paymentsReport'),
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      component: <PaymentsReportCard />
    }
  ];

  const selectedReportData = reportBoxes.find(box => box.id === selectedReport);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <ReportHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in">
          {reportBoxes.map((box) => {
            const Icon = box.icon;
            return (
              <Card 
                key={box.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                onClick={() => setSelectedReport(box.id)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${box.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {box.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t('clickToViewDetails')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedReportData?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedReportData?.component}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
