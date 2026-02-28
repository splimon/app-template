'use client';

import { usePWA } from '@/hooks/contexts/PWAContext';

// Custom Safari icon since lucide-react doesn't have one
function SafariIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function IOSOtherBrowserMessage() {
  const { browser } = usePWA();

  const browserName = browser === 'chrome' ? 'Chrome' : browser === 'firefox' ? 'Firefox' : 'this browser';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
        <SafariIcon className="w-16 h-16 text-blue-500" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-medium">Open in Safari to Install</h3>
        <p className="text-sm text-muted-foreground">
          Unfortunately, {browserName} on iOS doesn&apos;t support adding apps to the home screen.
        </p>
        <p className="text-sm text-muted-foreground">
          To install Kilo Tracker, open this page in{' '}
          <span className="font-medium text-blue-500">Safari</span> and follow the instructions there.
        </p>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Tip:</strong> Copy the URL from {browserName} and paste it into Safari, or use the share menu to open in Safari.
        </p>
      </div>
    </div>
  );
}
