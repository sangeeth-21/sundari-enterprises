import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCheckins } from '@/hooks/useCheckins';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { DeleteCheckinDialog } from './DeleteCheckinDialog';
import { PhotoViewDialog } from './PhotoViewDialog';
import { 
  Calendar,
  Camera,
  Clock,
  MapPin,
  User,
  Phone,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CheckinRecord } from '@/hooks/useCheckins';

export const CheckinHistory: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { checkins, isLoading, error, deleteCheckin } = useCheckins();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkinToDelete, setCheckinToDelete] = useState<CheckinRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    shopName: string;
    checkinTime: string;
  } | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const checkinTime = new Date(dateString);
    const diffMs = now.getTime() - checkinTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} ${t('minutesAgo')}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t('hoursAgo')}`;
    } else {
      return `${diffDays} ${t('daysAgo')}`;
    }
  };

  const handleViewPhoto = (photoUrl: string, shopName: string, checkinTime: string) => {
    setSelectedPhoto({
      url: photoUrl,
      shopName: shopName,
      checkinTime: checkinTime
    });
    setPhotoDialogOpen(true);
  };

  const handleDeleteClick = (checkin: CheckinRecord) => {
    setCheckinToDelete(checkin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (checkinId: number) => {
    setIsDeleting(true);
    
    try {
      const success = await deleteCheckin(checkinId);
      
      if (success) {
        toast({
          title: t('success'),
          description: t('checkinDeletedSuccessfully'),
        });
        setDeleteDialogOpen(false);
        setCheckinToDelete(null);
      } else {
        toast({
          title: t('error'),
          description: t('failedToDeleteCheckin'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting checkin:', error);
      toast({
        title: t('error'),
        description: t('failedToDeleteCheckin'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary transition-all duration-300">
            <Calendar className="w-5 h-5" />
            {t('recentCheckins')}
          </CardTitle>
          <CardDescription className="text-muted-foreground transition-all duration-300">
            {checkins.length} {t('checkinsFound')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground transition-all duration-300">{t('errorLoadingCheckins')}</p>
              <p className="text-muted-foreground transition-all duration-300">{t('tryRefreshingPage')}</p>
            </div>
          ) : checkins.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground transition-all duration-300">{t('noRecentCheckins')}</p>
              <p className="text-muted-foreground transition-all duration-300">{t('startByCreatingFirstCheckin')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {checkins.map((checkin) => {
                const { date, time } = formatDateTime(checkin.checkin_time);
                
                return (
                  <div
                    key={checkin.id}
                    className="p-4 bg-accent/20 rounded-xl hover:bg-accent/30 transition-all duration-300 hover:scale-[1.01] border border-primary/10 animate-fade-in"
                  >
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-foreground transition-all duration-300 truncate">
                              {checkin.shop_name}
                            </h3>
                            <Badge 
                              variant="secondary"
                              className="bg-success/20 text-success border-success/20 flex items-center gap-1 transition-all duration-300 flex-shrink-0"
                            >
                              <Camera className="w-3 h-3" />
                              {t('completed')}
                            </Badge>
                          </div>
                          
                          {/* Customer and User Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-muted-foreground transition-all duration-300 truncate">
                                  {t('customer')}: <span className="font-medium">{checkin.customer_name}</span>
                                </p>
                                <p className="text-xs text-muted-foreground/70 transition-all duration-300 truncate">
                                  {t('checkinBy')}: {checkin.user_name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 min-w-0">
                              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground transition-all duration-300 truncate">{checkin.user_phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time and Actions Section */}
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-3">
                        {/* Time Display */}
                        <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground transition-all duration-300">{time}</span>
                              <span className="text-muted-foreground transition-all duration-300">•</span>
                              <span className="text-muted-foreground transition-all duration-300">{date}</span>
                            </div>
                            <p className="text-xs text-primary font-medium transition-all duration-300">{getTimeAgo(checkin.checkin_time)}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {checkin.shop_photo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPhoto(checkin.shop_photo, checkin.shop_name, checkin.checkin_time)}
                              className="hover:bg-primary/10 border-primary/20 hover-scale transition-all duration-300 flex-shrink-0"
                            >
                              <Eye className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">{t('viewPhoto')}</span>
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(checkin)}
                            className="hover:bg-destructive/10 border-destructive/20 text-destructive hover:text-destructive hover-scale transition-all duration-300 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('delete')}</span>
                          </Button>
                          
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-muted-foreground transition-all duration-300">ID: {checkin.id}</p>
                            <p className="text-xs text-muted-foreground transition-all duration-300 truncate max-w-20">
                              {t('currentUser')}: {checkin.current_user}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteCheckinDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        checkin={checkinToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {selectedPhoto && (
        <PhotoViewDialog
          open={photoDialogOpen}
          onOpenChange={setPhotoDialogOpen}
          photoUrl={selectedPhoto.url}
          shopName={selectedPhoto.shopName}
          checkinTime={selectedPhoto.checkinTime}
        />
      )}
    </>
  );
};
