
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Lock, Phone, Building } from 'lucide-react';

export const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(phone, password);
    if (success) {
      toast({
        title: t('success'),
        description: t('welcomeBack')
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: t('error'),
        description: 'Invalid phone number or password',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-muted/30 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md shadow-card hover:shadow-card-hover transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <img 
              src="/lovable-uploads/aad534d0-e9ca-4a51-a491-c028f3d4c3ec.png" 
              alt="Sundari Enterprises" 
              className="w-12 h-12 object-contain" 
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sundari Enterprises
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('signInToAccount')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4" />
                {t('phone')}
              </Label>
              <Input 
                id="phone" 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder={t('enterPhoneNumber')}
                required 
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4" />
                {t('password')}
              </Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50" 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  {t('loading')}
                </div>
              ) : (
                t('loginButton')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
