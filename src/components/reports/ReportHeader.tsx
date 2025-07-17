
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export const ReportHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight transition-all duration-300">
          {t('reports')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground transition-all duration-300">
          {t('generateDetailedReports')}
        </p>
      </div>
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>
    </div>
  );
};
