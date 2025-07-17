
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, Users, TrendingUp, CreditCard } from 'lucide-react';

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { value: 'stock', icon: Package, label: t('stockReport') },
    { value: 'customers', icon: Users, label: t('customerBalanceReport') },
    { value: 'sales', icon: TrendingUp, label: t('salesReport') },
    { value: 'payments', icon: CreditCard, label: t('paymentsReport') },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 rounded-lg min-w-[600px] lg:min-w-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex flex-col sm:flex-row items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300 min-h-[60px] sm:min-h-[50px]"
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium leading-tight text-center sm:text-left transition-all duration-300">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};
