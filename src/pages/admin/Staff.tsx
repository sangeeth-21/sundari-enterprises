
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StaffForm } from '@/components/staff/StaffForm';
import { StaffCard } from '@/components/staff/StaffCard';
import { useStaff, StaffMember } from '@/hooks/useStaff';
import { 
  Users, 
  Plus, 
  Search,
  UserX,
  RefreshCw
} from 'lucide-react';

export const Staff: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const { staff, isLoading, createStaff, updateStaff, deleteStaff, fetchStaff } = useStaff();

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only admin can access staff management
  if (user?.role !== 'admin') {
    return (
      <Card className="shadow-card bg-card border-primary/20">
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <Users className="w-16 h-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">{t('accessDenied')}</h3>
                <p className="text-muted-foreground">{t('noPermissionMessage')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCreateStaff = async (staffData: any) => {
    setIsFormLoading(true);
    const success = await createStaff(staffData);
    setIsFormLoading(false);
    return success;
  };

  const handleUpdateStaff = async (staffData: any) => {
    if (!editingStaff) return false;
    setIsFormLoading(true);
    const success = await updateStaff(editingStaff.id, staffData);
    setIsFormLoading(false);
    return success;
  };

  const handleEditStaff = (member: StaffMember) => {
    console.log('Editing staff member:', member);
    setEditingStaff(member);
    setIsFormOpen(true);
  };

  const handleDeleteStaff = async (staffId: string) => {
    await deleteStaff(staffId);
  };

  const handleAddNewStaff = () => {
    console.log('Adding new staff member');
    setEditingStaff(null); // Ensure we're not editing
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleRefresh = () => {
    fetchStaff();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t('staff')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('manageBrands')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
          <Button 
            onClick={handleAddNewStaff}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('addStaff')}
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="shadow-card bg-card border-primary/20">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={`${t('search')} staff members...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-card bg-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.length}</p>
                <p className="text-sm text-muted-foreground">{t('totalStaff')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card className="shadow-card bg-card border-primary/20">
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t('staffList')}
          </CardTitle>
          <CardDescription>
            {filteredStaff.length} staff members found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  onEdit={handleEditStaff}
                  onDelete={handleDeleteStaff}
                />
              ))}
              
              {filteredStaff.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <UserX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchTerm ? t('noMatchingStaffFound') : t('noStaffFound')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? t('tryAdjustingSearchCriteria')
                      : t('getStartedByAdding')
                    }
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={handleAddNewStaff}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('addStaff')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Form Modal */}
      <StaffForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
        editingStaff={editingStaff}
        isLoading={isFormLoading}
      />
    </div>
  );
};
