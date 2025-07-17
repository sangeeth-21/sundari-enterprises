
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { 
  Users, 
  Package, 
  Building, 
  Receipt,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  Eye,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto">
          <CardContent>
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
              <p className="text-lg font-medium text-destructive">{t('failedToLoadDashboard')}</p>
              <p className="text-muted-foreground">{t('tryRefreshingPage')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboardData = data?.data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary transition-all duration-300">
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground transition-all duration-300">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('todaySales')}
          value={`₹${dashboardData?.sales.today.total || '0.00'}`}
          icon={TrendingUp}
          trend={{ 
            value: parseInt(String(dashboardData?.sales.today.count || 0)), 
            isPositive: true 
          }}
          isLoading={isLoading}
        />
        <StatCard
          title={t('totalCustomers')}
          value={dashboardData?.customers.total || '0'}
          icon={Users}
          trend={{ 
            value: parseInt(String(dashboardData?.customers.with_pending || 0)), 
            isPositive: false 
          }}
          isLoading={isLoading}
        />
        <StatCard
          title={t('totalProducts')}
          value={dashboardData?.products.total || '0'}
          icon={Package}
          trend={{ 
            value: parseInt(String(dashboardData?.products.low_stock || 0)), 
            isPositive: false 
          }}
          isLoading={isLoading}
        />
        <StatCard
          title={t('inventoryValue')}
          value={`₹${dashboardData?.inventory_value || '0.00'}`}
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-success" />
              {t('profitOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('todayProfit')}</span>
                  <span className="font-semibold text-success">₹{dashboardData?.profit.today || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('monthlyProfit')}</span>
                  <span className="font-semibold text-success">₹{dashboardData?.profit.month || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('yearlyProfit')}</span>
                  <span className="font-semibold text-success">₹{dashboardData?.profit.year || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-warning" />
              {t('pendingAmount')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('pendingCustomers')}</span>
                  <span className="font-semibold text-warning">₹{dashboardData?.pending.customers || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('pendingBills')}</span>
                  <span className="font-semibold text-warning">₹{dashboardData?.pending.bills || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('withPending')}</span>
                  <span className="font-semibold">{dashboardData?.customers.with_pending || '0'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" />
              {t('quickStats')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('lowStockItems')}</span>
                  <span className="font-semibold text-destructive">{dashboardData?.products.low_stock || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('outOfStockItems')}</span>
                  <span className="font-semibold text-destructive">{dashboardData?.products.out_of_stock || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('todayBills')}</span>
                  <span className="font-semibold">{dashboardData?.sales.today.count || '0'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills */}
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              {t('recentBills')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.recent_bills?.slice(0, 5).map((bill) => (
                  <div 
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-primary/10"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {bill.shop_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bill.bill_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{bill.total_amount}</p>
                      <p className={`text-xs ${bill.payment_status === 'paid' ? 'text-success' : 'text-warning'}`}>
                        {t(bill.payment_status)}
                      </p>
                    </div>
                  </div>
                ))}
                {!dashboardData?.recent_bills?.length && (
                  <p className="text-center text-muted-foreground py-4">{t('noDataFound')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t('recentPayments')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.recent_payments?.slice(0, 5).map((payment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-primary/10"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {payment.shop_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.payment_date} • {t(payment.payment_mode)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success">₹{payment.amount}</p>
                    </div>
                  </div>
                ))}
                {!dashboardData?.recent_payments?.length && (
                  <p className="text-center text-muted-foreground py-4">{t('noDataFound')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {t('topProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.top_products?.slice(0, 5).map((product, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-primary/10"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{product.total_sold} {t('totalSold')}</p>
                    </div>
                  </div>
                ))}
                {!dashboardData?.top_products?.length && (
                  <p className="text-center text-muted-foreground py-4">{t('noDataFound')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-primary/20 bg-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t('topCustomers')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.top_customers?.slice(0, 5).map((customer, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-primary/10"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {customer.shop_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{customer.total_purchases}</p>
                    </div>
                  </div>
                ))}
                {!dashboardData?.top_customers?.length && (
                  <p className="text-center text-muted-foreground py-4">{t('noDataFound')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
