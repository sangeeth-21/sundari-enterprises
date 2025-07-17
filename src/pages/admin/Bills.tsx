
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BillDetailsDialog } from '@/components/bills/BillDetailsDialog';
import { CreateBillDialog } from '@/components/bills/CreateBillDialog';
import { RecordPaymentDialog } from '@/components/bills/RecordPaymentDialog';
import { DeleteBillDialog } from '@/components/bills/DeleteBillDialog';
import { useBills } from '@/hooks/useBills';
import { 
  Receipt, 
  Plus, 
  Search,
  Eye,
  Download,
  Calendar,
  DollarSign,
  User,
  Clock,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
} from 'lucide-react';

export const Bills: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedPaymentBill, setSelectedPaymentBill] = useState<{
    id: string;
    bill_number: string;
    pending_amount: string;
  } | null>(null);
  const [selectedDeleteBill, setSelectedDeleteBill] = useState<{
    id: string;
    bill_number: string;
  } | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: bills, isLoading, error } = useBills();

  const filteredBills = bills?.filter(bill =>
    bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <TrendingUp className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const handleViewBill = (billId: string) => {
    setSelectedBillId(billId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedBillId(null);
  };

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleOpenPayment = (bill: typeof filteredBills[0]) => {
    setSelectedPaymentBill({
      id: bill.id,
      bill_number: bill.bill_number,
      pending_amount: bill.pending_amount,
    });
    setIsPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setIsPaymentOpen(false);
    setSelectedPaymentBill(null);
  };

  const handleOpenDelete = (bill: typeof filteredBills[0]) => {
    setSelectedDeleteBill({
      id: bill.id,
      bill_number: bill.bill_number,
    });
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setSelectedDeleteBill(null);
  };

  // Calculate summary stats
  const totalBills = filteredBills.length;
  const totalAmount = filteredBills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0);
  const totalPaid = filteredBills.reduce((sum, bill) => sum + parseFloat(bill.paid_amount), 0);
  const totalPending = filteredBills.reduce((sum, bill) => sum + parseFloat(bill.pending_amount), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary transition-all duration-300">
            {t('bills')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('manageBillsAndPayments')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              const pendingBill = filteredBills.find(bill => parseFloat(bill.pending_amount) > 0);
              if (pendingBill) {
                handleOpenPayment(pendingBill);
              }
            }}
            variant="outline"
            className="bg-success/10 hover:bg-success/20 text-success border-success/20 shadow-lg hover-scale transition-all duration-200"
            disabled={!filteredBills.some(bill => parseFloat(bill.pending_amount) > 0)}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {t('recordPayment')}
          </Button>
          <Button 
            onClick={handleOpenCreate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-scale transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('createBill')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalBills')}</p>
                <p className="text-2xl font-bold text-foreground">{totalBills}</p>
              </div>
              <Receipt className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalAmount')}</p>
                <p className="text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalPaid')}</p>
                <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalPending')}</p>
                <p className={`text-2xl font-bold ${totalPending > 0 ? 'text-warning' : 'text-success'}`}>
                  ₹{Math.abs(totalPending).toLocaleString()}
                </p>
              </div>
              <Clock className={`w-8 h-8 ${totalPending > 0 ? 'text-warning' : 'text-success'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card bg-card border-primary/20 transition-all duration-300">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`${t('search')} ${t('bills')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card className="shadow-card bg-card border-primary/20 transition-all duration-300">
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {t('billHistory')}
          </CardTitle>
          <CardDescription>
            {filteredBills.length} {t('billsFound')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">{t('errorLoadingBills')}</p>
              <p className="text-muted-foreground">{t('tryRefreshingPage')}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 bg-accent/20 rounded-xl hover:bg-accent/30 transition-all duration-200 hover:scale-[1.01] border border-primary/10 animate-fade-in"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-foreground">
                          {bill.bill_number}
                        </h3>
                        <Badge 
                          variant="secondary"
                          className={`${getStatusColor(bill.payment_status)} flex items-center gap-1 transition-all duration-200`}
                        >
                          {getStatusIcon(bill.payment_status)}
                          {t(bill.payment_status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-muted-foreground truncate">{bill.shop_name}</p>
                            <p className="text-xs text-muted-foreground/70 truncate">{bill.owner_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-muted-foreground font-medium">₹{bill.total_amount}</p>
                            <p className="text-xs text-success">{t('paidLabel')}: ₹{bill.paid_amount}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {new Date(bill.bill_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className={`text-sm ${
                            parseFloat(bill.pending_amount) > 0 ? 'text-warning font-medium' : 'text-success'
                          }`}>
                            {parseFloat(bill.pending_amount) > 0 
                              ? `${t('pendingLabel')}: ₹${bill.pending_amount}` 
                              : t('fullyPaid')
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {parseFloat(bill.pending_amount) > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-success/10 border-success/20 text-success hover-scale transition-all duration-200"
                          onClick={() => handleOpenPayment(bill)}
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-primary/10 border-primary/20 hover-scale transition-all duration-200"
                        onClick={() => handleViewBill(bill.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-success/10 border-success/20 hover-scale transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-destructive/10 border-destructive/20 text-destructive hover-scale transition-all duration-200"
                        onClick={() => handleOpenDelete(bill)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredBills.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">{t('noBillsFound')}</p>
                  <p className="text-muted-foreground">{t('tryAdjustingSearchCriteria')}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill Details Dialog */}
      <BillDetailsDialog
        billId={selectedBillId}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      {/* Create Bill Dialog */}
      <CreateBillDialog
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
      />

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        isOpen={isPaymentOpen}
        onClose={handleClosePayment}
        bill={selectedPaymentBill}
      />

      {/* Delete Bill Dialog */}
      <DeleteBillDialog
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        bill={selectedDeleteBill}
      />
    </div>
  );
};
