
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomers } from '@/hooks/useCustomers';
import { useCheckins } from '@/hooks/useCheckins';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Camera, User, X, Check, Clock, Calendar } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface CheckinFormData {
  customerId: string;
  shopPhoto: File | null;
}

export const CheckinForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { customers, isLoading: customersLoading } = useCustomers();
  const { createCheckin } = useCheckins();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureTime, setCaptureTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const form = useForm<CheckinFormData>({
    defaultValues: {
      customerId: '',
      shopPhoto: null,
    },
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to load before showing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: t('error'),
        description: t('cameraAccessDenied'),
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size to reduce photo size
      const maxWidth = 800;
      const maxHeight = 600;
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      
      let canvasWidth = maxWidth;
      let canvasHeight = maxWidth / videoAspectRatio;
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * videoAspectRatio;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'shop-photo.jpg', { type: 'image/jpeg' });
            setCapturedPhoto(file);
            setPhotoPreview(canvas.toDataURL());
            setCaptureTime(new Date());
            form.setValue('shopPhoto', file);
            stopCamera();
          }
        }, 'image/jpeg', 0.7); // Reduced quality for smaller file size
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setPhotoPreview(null);
    setCaptureTime(null);
    form.setValue('shopPhoto', null);
    startCamera();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const onSubmit = async (data: CheckinFormData) => {
    if (!data.customerId || !capturedPhoto) {
      toast({
        title: t('error'),
        description: t('pleaseFillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await createCheckin(parseInt(data.customerId), capturedPhoto);
      
      if (success) {
        toast({
          title: t('success'),
          description: t('checkinSuccessful'),
        });
        
        // Reset form
        form.reset();
        setCapturedPhoto(null);
        setPhotoPreview(null);
        setCaptureTime(null);
      } else {
        toast({
          title: t('error'),
          description: t('failedToCheckin'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating checkin:', error);
      toast({
        title: t('error'),
        description: t('failedToCheckin'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary transition-all duration-300">
          <Camera className="w-5 h-5" />
          {t('checkInNow')}
        </CardTitle>
        <CardDescription className="text-muted-foreground transition-all duration-300">
          {t('selectCustomerToCheckin')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Selection */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium transition-all duration-300">
                    <User className="w-4 h-4 text-primary" />
                    {t('selectCustomer')}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 bg-background border-primary/20 hover:border-primary/40 transition-all duration-300">
                        <SelectValue placeholder={t('selectCustomer')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customersLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <LoadingSpinner size="sm" />
                        </div>
                      ) : (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{customer.shop_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {customer.owner_name}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Camera Section */}
            <FormField
              control={form.control}
              name="shopPhoto"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium transition-all duration-300">
                    <Camera className="w-4 h-4 text-primary" />
                    {t('takeShopPhoto')}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!isCameraOpen && !photoPreview && (
                        <Button
                          type="button"
                          onClick={startCamera}
                          variant="outline"
                          className="w-full h-32 bg-accent/20 hover:bg-accent/30 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Camera className="w-8 h-8 text-primary" />
                            <span className="text-foreground font-medium transition-all duration-300">{t('openCamera')}</span>
                          </div>
                        </Button>
                      )}

                      {isCameraOpen && (
                        <div className="space-y-4">
                          <div className="relative rounded-lg overflow-hidden bg-black min-h-[240px] flex items-center justify-center">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-64 object-cover rounded-lg"
                              style={{ transform: 'scaleX(-1)' }}
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              onClick={capturePhoto}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-scale transition-all duration-300"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              {t('capturePhoto')}
                            </Button>
                            <Button
                              type="button"
                              onClick={stopCamera}
                              variant="outline"
                              className="hover:bg-destructive/10 border-destructive/20 text-destructive hover-scale transition-all duration-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {photoPreview && captureTime && (
                        <div className="space-y-4">
                          <div className="relative rounded-lg overflow-hidden">
                            <img
                              src={photoPreview}
                              alt="Captured shop photo"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                            {/* Time and Date overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <div className="flex justify-between items-end text-white">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-medium">{formatTime(captureTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-sm font-medium">{formatDate(captureTime)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-success/20 rounded-lg border border-success/20 transition-all duration-300">
                            <Check className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-success transition-all duration-300">{t('photoReady')}</span>
                            <Button
                              type="button"
                              onClick={retakePhoto}
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-muted-foreground hover:text-foreground transition-all duration-300"
                            >
                              {t('retake')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !capturedPhoto || !form.watch('customerId')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-scale transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('creating')}
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  {t('checkInNow')}
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};
