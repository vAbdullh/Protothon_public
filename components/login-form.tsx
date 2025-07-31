'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './shadcn/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './shadcn/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './shadcn/tabs';
import { Input } from './shadcn/input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('password');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const t = useTranslations('DashboardLogin');

  const validateEmail = () => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'errEmailRequired' }));
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'errInvalidEmail' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = () => {
    if (!password && activeTab === 'password') {
      setErrors(prev => ({ ...prev, password: 'errPasswordRequired' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (isEmailValid && isPasswordValid) {
      console.log('Login submitted', { email, password, method: activeTab });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">{t('loginPassword')}</TabsTrigger>
            <TabsTrigger value="email">{t('loginEmail')}</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                />
                {errors.email && <p className="text-sm text-red-500">{t(errors.email)}</p>}
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                />
                {errors.password && <p className="text-sm text-red-500">{t(errors.password)}</p>}
              </div>
              <Button type="submit" className="w-full">
                {t('loginPassword')}
              </Button>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email-only"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                />
                {errors.email && <p className="text-sm text-red-500">{t(errors.email)}</p>}
              </div>
              <Button type="submit" className="w-full">
                {t('loginEmail')}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
