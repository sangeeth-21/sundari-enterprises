
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Camera, Users, Calendar } from 'lucide-react';
import { CheckinForm } from '@/components/checkin/CheckinForm';
import { CheckinHistory } from '@/components/checkin/CheckinHistory';
import { useCheckins } from '@/hooks/useCheckins';

export const CheckIn: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { checkins } = useCheckins();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate summary stats
  const totalCheckins = checkins.length;
  const todayCheckins = checkins.filter(checkin => {
    const today = new Date().toDateString();
    const checkinDate = new Date(checkin.checkin_time).toDateString();
    return today === checkinDate;
  }).length;

  const thisWeekCheckins = checkins.filter(checkin => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const checkinDate = new Date(checkin.checkin_time);
    return checkinDate >= weekAgo;
  }).length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary transition-all duration-300">
            {t('checkin')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('trackYourVisits')}
          </p>
        </div>
        
        {/* Current Time Display */}
        <Card className="shadow-card bg-card border-primary/20 transition-all duration-300">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t('currentTime')}</span>
              </div>
              <div className="text-2xl font-bold text-primary font-mono">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(currentTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalCheckins')}</p>
                <p className="text-2xl font-bold text-foreground">{totalCheckins}</p>
              </div>
              <Camera className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('todayCheckins')}</p>
                <p className="text-2xl font-bold text-success">{todayCheckins}</p>
              </div>
              <Calendar className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-card border-primary/20 hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('thisWeekCheckins')}</p>
                <p className="text-2xl font-bold text-warning">{thisWeekCheckins}</p>
              </div>
              <Users className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-in Form and History */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Check-in Form */}
        <div className="space-y-6">
          <CheckinForm />
        </div>

        {/* Check-in History */}
        <div className="space-y-6">
          <CheckinHistory />
        </div>
      </div>
    </div>
  );
};
