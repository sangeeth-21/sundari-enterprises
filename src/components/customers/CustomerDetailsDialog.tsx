
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Phone,
  MapPin,
  Building,
  Calendar,
  Wallet,
  FileText,
  CreditCard,
  IndianRupee,
  Clock,
  Hash,
  Receipt,
  DollarSign,
} from 'lucide-react';

interface Bill {
  id: number;
  bill_number: string;
  bill_date: string;
  total_amount: string;
  paid_amount: string;
  pending_amount: string;
  payment_status: string;
}

interface Payment {
  id: number;
  amount: string;
  payment_date: string;
  payment_mode: string;
  reference_number: string | null;
  notes: string;
}

interface CustomerDetails {
  id: number;
  shop_name: string;
  owner_name: string;
  phone: string;
  address: string;
  balance: string;
  paid_amount: string;
  pending_amount: string;
  created_at: string;
  updated_at: string;
  bills: Bill[];
  payments: Payment[];
}

interface CustomerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

export const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
  isOpen,
  onClose,
  customerId,
}) => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomerDetails = async (id: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.specd.in/sundarienterprises/index.php/customers/${id}`,
        {
          method: 'GET',
          headers: {
            'X-User-ID': token,
          },
        }
      );

      const result = await response.json();
      console.log('Customer details API response:', result);

      if (result.success) {
        setCustomerDetails(result.data);
      } else {
        console.error('Failed to fetch customer details:', result.message);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [isOpen, customerId, token]);

  const handleClose = () => {
    setCustomerDetails(null);
    onClose();
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">{t('paid')}</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">{t('pending')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            {t('customerDetails') || 'Customer Details'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : customerDetails ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {t('basicInformation') || 'Basic Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('shopName')}</p>
                      <p className="font-medium">{customerDetails.shop_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('ownerName')}</p>
                      <p className="font-medium">{customerDetails.owner_name}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('phone')}</p>
                      <p className="font-medium">{customerDetails.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('address')}</p>
                      <p className="font-medium">{customerDetails.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  {t('financialSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <IndianRupee className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">{t('balance')}</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(customerDetails.balance)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-success" />
                    <p className="text-sm text-muted-foreground">{t('paidAmount')}</p>
                    <p className="text-xl font-bold text-success">
                      {formatCurrency(customerDetails.paid_amount)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-warning" />
                    <p className="text-sm text-muted-foreground">{t('pendingAmount')}</p>
                    <p className="text-xl font-bold text-warning">
                      {formatCurrency(customerDetails.pending_amount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bills */}
            {customerDetails.bills && customerDetails.bills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {t('bills') || 'Bills'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerDetails.bills.map((bill) => (
                      <div
                        key={bill.id}
                        className="p-4 border rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{bill.bill_number}</span>
                              {getPaymentStatusBadge(bill.payment_status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(bill.bill_date)}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-muted-foreground">{t('totalAmount') || 'Total'}</p>
                              <p className="font-medium">{formatCurrency(bill.total_amount)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">{t('paidAmount') || 'Paid'}</p>
                              <p className="font-medium text-success">{formatCurrency(bill.paid_amount)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">{t('pendingAmount') || 'Pending'}</p>
                              <p className="font-medium text-warning">{formatCurrency(bill.pending_amount)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payments */}
            {customerDetails.payments && customerDetails.payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {t('payments') || 'Payments'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerDetails.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="p-4 border rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{formatCurrency(payment.amount)}</span>
                              <Badge variant="outline" className="capitalize">
                                {payment.payment_mode}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(payment.payment_date)}
                            </div>
                            {payment.notes && (
                              <p className="text-sm text-muted-foreground">{payment.notes}</p>
                            )}
                          </div>
                          {payment.reference_number && (
                            <div className="text-sm">
                              <p className="text-muted-foreground">{t('referenceNumber') || 'Ref'}</p>
                              <p className="font-medium">{payment.reference_number}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">{t('createdAt') || 'Created'}</p>
                      <p className="font-medium">{formatDate(customerDetails.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">{t('updatedAt') || 'Updated'}</p>
                      <p className="font-medium">{formatDate(customerDetails.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('noDataFound')}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
