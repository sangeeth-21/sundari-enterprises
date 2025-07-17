import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  isLoading,
  className
}) => {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] border-0 shadow-card bg-gradient-to-br from-card to-card/80",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">
                  {value}
                </p>
                {trend && (
                  <div className={cn(
                    "text-xs font-medium flex items-center gap-1",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}>
                    <span>{trend.isPositive ? "↗" : "↘"}</span>
                    {Math.abs(trend.value)}%
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            "bg-gradient-primary shadow-lg"
          )}>
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -translate-y-16 translate-x-16" />
      </CardContent>
    </Card>
  );
};