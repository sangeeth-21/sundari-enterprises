import React, { useState, useRef, useEffect } from 'react';
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
  const [isCameraReady, setIsCameraReady] = useState(false);
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

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraReady(false);
      setIsCameraOpen(true);

      // Request camera access with fallback options
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        },
        audio: false
      };

      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        // Fallback to basic constraints if advanced constraints fail
        console.warn('Advanced camera constraints failed, trying basic constraints:', error);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setIsCameraReady(true);
              })
              .catch((playError) => {
                console.error('Error playing video:', playError);
                toast({
                  title: t('error'),
                  description: t('cameraPlaybackError') || 'Failed to start camera playback',
                  variant: 'destructive',
                });
              });
          }
        };

        // Handle video errors
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
          toast({
            title: t('error'),
            description: t('cameraError') || 'Camera error occurred',
            variant: 'destructive',
          });
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraOpen(false);
      setIsCameraReady(false);
      
      let errorMessage = t('cameraAccessDenied') || 'Camera access denied';
      
      if (error instanceof Error) {
        if (error.name === 'NotFoundError') {
          errorMessage = t('cameraNotFound') || 'No camera found on this device';
        } else if (error.name === 'NotAllowedError') {
          errorMessage = t('cameraPermissionDenied') || 'Camera permission denied';
        } else if (error.name === 'NotReadableError') {
          errorMessage = t('cameraInUse') || 'Camera is already in use';
        }
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOpen(false);
    setIsCameraReady(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        toast({
          title: t('error'),
          description: t('canvasError') || 'Canvas not available',
          variant: 'destructive',
        });
        return;
      }

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
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
      
      // Add timestamp overlay to the canvas
      const now = new Date();
      const timeString = formatTime(now);
      const dateString = formatDate(now);
      
      // Set text properties
      context.font = '14px Arial, sans-serif';
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.textAlign = 'right';
      
      // Add background rectangles for text
      const timeText = timeString;
      const dateText = dateString;
      const timeWidth = context.measureText(timeText).width;
      const dateWidth = context.measureText(dateText).width;
      const padding = 8;
      const lineHeight = 20;
      
      // Draw background rectangles
      context.fillRect(canvasWidth - Math.max(timeWidth, dateWidth) - padding * 2, canvasHeight - lineHeight * 2 - padding * 2, Math.max(timeWidth, dateWidth) + padding * 2, lineHeight * 2 + padding * 2);
      
      // Draw text
      context.fillStyle = 'white';
      context.fillText(timeText, canvasWidth - padding, canvasHeight - lineHeight - padding);
      context.fillText(dateText, canvasWidth - padding, canvasHeight - padding);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `shop-photo-${now.getTime()}.jpg`, { type: 'image/jpeg' });
          setCapturedPhoto(file);
          setPhotoPreview(canvas.toDataURL('image/jpeg', 0.8));
          setCaptureTime(now);
          form.setValue('shopPhoto', file);
          stopCamera();
        } else {
          toast({
            title: t('error'),
            description: t('photoCaptureFailed') || 'Failed to capture photo',
            variant: 'destructive',
          });
        }
      }, 'image/jpeg', 0.8);
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
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
      // Add timestamp metadata to the photo
      const uploadTime = new Date();
      const photoWithTimestamp = new File(
        [capturedPhoto], 
        `shop-photo-${uploadTime.getTime()}.jpg`,
        { 
          type: 'image/jpeg',
          lastModified: uploadTime.getTime()
        }
      );

      const success = await createCheckin(parseInt(data.customerId), photoWithTimestamp);
      
      if (success) {
        toast({
          title: t('success'),
          description: `${t('checkinSuccessful')} - ${formatTime(uploadTime)} ${formatDate(uploadTime)}`,
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
                          className="w-full h-40 bg-accent/20 hover:bg-accent/30 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-3"
                        >
                          <Camera className="w-8 h-8 text-primary" />
                          <span className="text-foreground font-medium transition-all duration-300">{t('openCamera')}</span>
                        </Button>
                      )}

                      {isCameraOpen && (
                        <div className="space-y-4">
                          <div className="relative rounded-lg overflow-hidden bg-black aspect-video w-full flex items-center justify-center">
                            {!isCameraReady && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                                <LoadingSpinner size="lg" className="text-white mb-3" />
                                <p className="text-white text-sm font-medium">{t('loadingCamera') || 'Loading camera...'}</p>
                              </div>
                            )}
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                              style={{ 
                                opacity: isCameraReady ? 1 : 0,
                                transition: 'opacity 0.3s ease'
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              onClick={capturePhoto}
                              disabled={!isCameraReady}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-scale transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              {t('capturePhoto')}
                            </Button>
                            <Button
                              type="button"
                              onClick={stopCamera}
                              variant="outline"
                              className="px-4 hover:bg-destructive/10 border-destructive/20 text-destructive hover-scale transition-all duration-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {photoPreview && captureTime && (
                        <div className="space-y-4">
                          <div className="relative rounded-lg overflow-hidden aspect-video w-full">
                            <img
                              src={photoPreview}
                              alt="Captured shop photo"
                              className="w-full h-full object-cover"
                            />
                            {/* Time and Date overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
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
                          <div className="flex items-center justify-between gap-3 p-4 bg-success/20 rounded-lg border border-success/30 transition-all duration-300">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-success" />
                              <span className="text-sm font-medium text-success transition-all duration-300">{t('photoReady')}</span>
                            </div>
                            <Button
                              type="button"
                              onClick={retakePhoto}
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground transition-all duration-300"
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
