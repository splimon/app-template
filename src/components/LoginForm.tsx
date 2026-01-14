'use client';

import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { SystemRole } from '../types/db';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import Link from 'next/link';

interface LoginFormProps {
  loginType: SystemRole;
}

export function LoginForm({ loginType }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(loginType, identifier, password);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {loginType === 'sysadmin' ? 'Internal Login' : 'User Login'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {loginType === 'sysadmin' ? 'Switch to ' : 'Switch to '}
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href={loginType === 'sysadmin' ? '/login?type=user' : '/login?type=sysadmin'}>
              {loginType === 'sysadmin' ? 'User Login' : 'Internal Login'}
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
