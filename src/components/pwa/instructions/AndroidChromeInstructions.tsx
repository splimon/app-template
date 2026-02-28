'use client';

import { MoreVertical, Plus, Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstructionStep } from './InstructionStep';
import { usePWA } from '@/hooks/contexts/PWAContext';

export function AndroidChromeInstructions() {
  const { deferredPrompt, triggerNativeInstall } = usePWA();

  // If native prompt is available, show a simple install button
  if (deferredPrompt) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
          <Download className="w-16 h-16 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Tap the button below to add Kilo Tracker to your home screen for quick access.
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

  // Manual fallback instructions
  return (
    <div className="space-y-3">
      <InstructionStep
        stepNumber={1}
        icon={MoreVertical}
        title="Tap the 3-dot menu"
        description="Look for the three vertical dots in the top-right corner of Chrome"
      />
      <InstructionStep
        stepNumber={2}
        icon={Plus}
        title='Tap "Add to Home screen"'
        description="Find this option in the menu that appears"
      />
      <InstructionStep
        stepNumber={3}
        icon={Smartphone}
        title='Tap "Add"'
        description="Confirm to add the app to your home screen"
      />
    </div>
  );
}
