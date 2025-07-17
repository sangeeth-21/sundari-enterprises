
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt, 
  UserCheck, 
  Building,
  Tag,
  LogOut,
  Menu,
  X,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const { user, permissions, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const allNavigationItems = [
    { 
      path: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: t('dashboard'),
      permissionKey: 'dashboard' as const
    },
    { 
      path: '/admin/bills', 
      icon: Receipt, 
      label: t('bills'),
      permissionKey: 'bills' as const
    },
    { 
      path: '/admin/products', 
      icon: Package, 
      label: t('products'),
      permissionKey: 'product' as const
    },
    { 
      path: '/admin/brands', 
      icon: Tag, 
      label: t('brands'),
      permissionKey: 'brand' as const
    },
    { 
      path: '/admin/customers', 
      icon: Building, 
      label: t('customers'),
      permissionKey: 'customer' as const
    },
    { 
      path: '/admin/checkin', 
      icon: UserCheck, 
      label: t('checkin'),
      permissionKey: 'checkin' as const
    },
    { 
      path: '/admin/reports', 
      icon: BarChart, 
      label: t('reports'),
      permissionKey: 'reports' as const
    },
  ];

  // Filter navigation items based on user permissions (only show items with permission value 1)
  const navigationItems = allNavigationItems.filter(item => 
    permissions && permissions[item.permissionKey] === 1
  );

  // Staff item for admin users (role-based, not permission-based)
  const staffItem = user?.role === 'admin' ? {
    path: '/admin/staff',
    icon: Users,
    label: t('staff')
  } : null;

  const handleLogout = () => {
    logout();
  };

  // Helper function to render navigation item
  const renderNavItem = (item: { path: string; icon: any; label: string }, key: string) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <NavLink
        key={key}
        to={item.path}
        onClick={() => window.innerWidth < 1024 && onToggle()}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group transform",
          isActive 
            ? "bg-gradient-primary text-primary-foreground shadow-lg scale-[1.02] shadow-primary/20" 
            : "hover:bg-accent/50 text-foreground hover:scale-[1.01] hover:shadow-md"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-all duration-300 ease-in-out",
          isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-105"
        )} />
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-screen bg-card border-r border-border/50 shadow-card z-50 transition-transform duration-300 ease-in-out",
          "lg:fixed lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-72 lg:w-64 flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img src="/lovable-uploads/aad534d0-e9ca-4a51-a491-c028f3d4c3ec.png" alt="Sundari Enterprises" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                Sundari Enterprises
              </h2>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role} {t('role')}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {/* Only show navigation items with permission value 1 */}
            {/* Render dashboard first if available */}
            {navigationItems
              .filter(item => item.path === '/admin/dashboard')
              .map(item => renderNavItem(item, item.path))
            }
            
            {/* Render staff item for admin users (after dashboard) */}
            {staffItem && renderNavItem(staffItem, staffItem.path)}
            
            {/* Render remaining navigation items */}
            {navigationItems
              .filter(item => item.path !== '/admin/dashboard')
              .map(item => renderNavItem(item, item.path))
            }
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
          </div>
          
          <div className="bg-muted/30 rounded-xl p-3 space-y-2">
            <div className="text-sm font-medium text-foreground">
              {user?.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.phone}
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </Button>
        </div>
      </div>
    </>
  );
};
