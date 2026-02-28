'use client';

import { Download, Plus, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstructionStep } from './InstructionStep';
import { usePWA } from '@/hooks/contexts/PWAContext';

export function DesktopInstructions() {
  const { deferredPrompt, triggerNativeInstall, browser } = usePWA();

  // If native prompt is available, show a simple install button
  if (deferredPrompt) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
          <Download className="w-16 h-16 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the button below to install Kilo Tracker as a desktop app for quick access.
          </p>
        </div>

        <Button
          onClick={triggerNativeInstall}
          className="w-full"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Install Kilo Tracker
        </Button>
      </div>
    );
  }

  const browserName = browser === 'chrome' ? 'Chrome' : browser === 'edge' ? 'Edge' : 'your browser';

  // Manual fallback instructions
  return (
    <div className="space-y-3">
      <InstructionStep
        stepNumber={1}
        icon={Plus}
        title="Look for the install icon"
        description={`Check the right side of ${browserName}'s address bar for an install icon (usually a + or computer icon)`}
      />
      <InstructionStep
        stepNumber={2}
        icon={Monitor}
        title='Click "Install"'
        description="Click the install button in the popup that appears"
      />

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> If you don&apos;t see the install icon, try refreshing the page or check the browser menu for an &quot;Install app&quot; option.
        </p>
      </div>
    </div>
  );
}
