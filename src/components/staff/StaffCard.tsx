
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { StaffMember } from '@/hooks/useStaff';
import { 
  Edit,
  Trash2,
  Phone,
  Calendar,
  Shield,
  User,
  Crown
} from 'lucide-react';

interface StaffCardProps {
  member: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  member,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();

  const getPermissionCount = (member: StaffMember) => {
    const permissions = [
      member.dashboard,
      member.bills,
      member.brand,
      member.product,
      member.customer,
      member.checkin,
      member.auditlogs,
      member.reports
    ];
    return permissions.filter(p => p === '1').length;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const handleEdit = () => {
    onEdit(member);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      onDelete(member.id);
    }
  };

  return (
    <div className="p-6 bg-card rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border border-border">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                {member.role === 'admin' ? (
                  <Crown className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {member.user_id}
                </p>
              </div>
            </div>
            <Badge 
              variant={member.role === 'admin' ? 'default' : 'secondary'}
              className={member.role === 'admin' ? 'bg-primary text-primary-foreground' : ''}
            >
              {member.role === 'admin' ? t('admin') : t('staffRole')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{member.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(member.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {getPermissionCount(member)}/8 {t('permissions')}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {member.dashboard === '1' && (
              <Badge variant="outline" className="text-xs">{t('dashboard')}</Badge>
            )}
            {member.bills === '1' && (
              <Badge variant="outline" className="text-xs">{t('bills')}</Badge>
            )}
            {member.brand === '1' && (
              <Badge variant="outline" className="text-xs">{t('brand')}</Badge>
            )}
            {member.product === '1' && (
              <Badge variant="outline" className="text-xs">{t('product')}</Badge>
            )}
            {member.customer === '1' && (
              <Badge variant="outline" className="text-xs">{t('customer')}</Badge>
            )}
            {member.checkin === '1' && (
              <Badge variant="outline" className="text-xs">{t('checkin')}</Badge>
            )}
            {member.auditlogs === '1' && (
              <Badge variant="outline" className="text-xs">{t('auditlogs')}</Badge>
            )}
            {member.reports === '1' && (
              <Badge variant="outline" className="text-xs">{t('reports')}</Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-primary/10 border-primary/20"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
