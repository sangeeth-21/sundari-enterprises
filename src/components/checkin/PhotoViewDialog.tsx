
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoUrl: string;
  shopName: string;
  checkinTime: string;
}

export const PhotoViewDialog: React.FC<PhotoViewDialogProps> = ({
  open,
  onOpenChange,
  photoUrl,
  shopName,
  checkinTime
}) => {
  const { t } = useLanguage();
  const [isZoomed, setIsZoomed] = React.useState(false);

  const fullPhotoUrl = `https://api.specd.in/sundarienterprises/uploads/${photoUrl}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullPhotoUrl;
    link.download = `${shopName}_${checkinTime}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(checkinTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{shopName}</h3>
              <p className="text-sm text-muted-foreground">{time} • {date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsZoomed(!isZoomed)}
                className="flex items-center gap-2"
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                {isZoomed ? t('zoomOut') : t('zoomIn')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('download')}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6 pt-4">
          <div className="relative w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
            <img
              src={fullPhotoUrl}
              alt={`${shopName} ${t('checkinPhoto')}`}
              className={`max-w-full max-h-full object-contain rounded transition-transform duration-300 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
                target.alt = t('failedToLoadImage');
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
