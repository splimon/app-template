'use client';

import { AlertCircle } from 'lucide-react';
import { usePWA } from '@/hooks/contexts/PWAContext';

export function UnsupportedBrowser() {
  const { platform, browser } = usePWA();

  const getSuggestion = () => {
    if (platform === 'ios') {
      return (
        <>
          To install this app, please open this page in{' '}
          <span className="font-medium text-blue-500">Safari</span>.
        </>
      );
    }

    if (platform === 'android') {
      return (
        <>
          To install this app, please open this page in{' '}
          <span className="font-medium text-green-500">Chrome</span> or{' '}
          <span className="font-medium text-purple-500">Samsung Internet</span>.
        </>
      );
    }

    return (
      <>
        To install this app, please open this page in{' '}
        <span className="font-medium text-blue-500">Chrome</span> or{' '}
        <span className="font-medium text-blue-500">Microsoft Edge</span>.
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center p-6 bg-amber-50 dark:bg-amber-950/50 rounded-lg">
        <AlertCircle className="w-16 h-16 text-amber-500" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-medium">Browser Not Supported</h3>
        <p className="text-sm text-muted-foreground">
          {browser === 'firefox' && platform === 'android'
            ? "Firefox on Android doesn't support installing web apps to the home screen."
            : "This browser doesn't support installing web apps."}
        </p>
        <p className="text-sm text-muted-foreground">{getSuggestion()}</p>
      </div>
    </div>
  );
}
