import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCustomers, Customer } from '@/hooks/useCustomers';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { DeleteCustomerDialog } from '@/components/customers/DeleteCustomerDialog';
import { CustomerDetailsDialog } from '@/components/customers/CustomerDetailsDialog';
import { 
  Building, 
  Plus, 
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye
} from 'lucide-react';

export const Customers: React.FC = () => {
  const { t } = useLanguage();
  const { customers, isLoading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const calculateTotals = () => {
    return filteredCustomers.reduce(
      (totals, customer) => ({
        balance: totals.balance + parseFloat(customer.balance || '0'),
        paid: totals.paid + parseFloat(customer.paid_amount || '0'),
        pending: totals.pending + parseFloat(customer.pending_amount || '0'),
      }),
      { balance: 0, paid: 0, pending: 0 }
    );
  };

  const totals = calculateTotals();

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const handleViewDetails = (customerId: string) => {
    setViewingCustomerId(customerId);
  };

  const handleCloseDetails = () => {
    setViewingCustomerId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t('customers')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('manageCustomerRelationships')}
          </p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addCustomer')}
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card bg-card border-primary/20">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`${t('search')} ${t('customers')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card bg-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalBalance')}</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{totals.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalPaid')}</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{totals.paid.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-full">
                <TrendingDown className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalPending')}</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{totals.pending.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card className="shadow-card bg-card border-primary/20">
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            {t('customerList')}
          </CardTitle>
          <CardDescription>
            {filteredCustomers.length} {t('customersFound')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 bg-accent/20 rounded-xl hover:bg-accent/30 transition-all duration-200 hover:scale-[1.01] border border-primary/10"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {customer.shop_name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {customer.owner_name}
                          </p>
                        </div>
                        <Badge 
                          variant={parseFloat(customer.pending_amount || '0') > 0 ? 'destructive' : 'default'}
                          className={parseFloat(customer.pending_amount || '0') > 0 ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'}
                        >
                          {parseFloat(customer.pending_amount || '0') > 0 ? t('pending') : t('paid')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{customer.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 bg-accent/20 rounded-lg">
                          <p className="text-muted-foreground">{t('balance')}</p>
                          <p className="font-semibold text-primary">₹{parseFloat(customer.balance || '0').toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2 bg-success/10 rounded-lg">
                          <p className="text-muted-foreground">{t('paidAmount')}</p>
                          <p className="font-semibold text-success">₹{parseFloat(customer.paid_amount || '0').toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2 bg-warning/10 rounded-lg">
                          <p className="text-muted-foreground">{t('pendingAmount')}</p>
                          <p className="font-semibold text-warning">₹{parseFloat(customer.pending_amount || '0').toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-primary/10 border-primary/20"
                        onClick={() => handleViewDetails(customer.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-primary/10 border-primary/20"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                        onClick={() => handleDelete(customer)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">{t('noCustomersFound')}</p>
                  <p className="text-muted-foreground">{t('tryAdjustingSearchCriteria')}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        customer={editingCustomer}
      />
      <DeleteCustomerDialog
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        customer={deletingCustomer}
      />
      <CustomerDetailsDialog
        isOpen={!!viewingCustomerId}
        onClose={handleCloseDetails}
        customerId={viewingCustomerId}
      />
    </div>
  );
};
