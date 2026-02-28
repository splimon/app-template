'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/contexts/PWAContext';
import { DesktopInstructions } from './instructions/DesktopInstructions';
import { UnsupportedBrowser } from './instructions/UnsupportedBrowser';

export function AddToHomescreenDialog() {
  const { isSheetOpen, setSheetOpen, platform, browser, dismissPrompt, deferredPrompt, triggerNativeInstall } = usePWA();

  // Only render dialog for desktop
  if (platform !== 'desktop') {
    return null;
  }

  const renderInstructions = () => {
    // Desktop Chrome/Edge can install
    if (browser === 'chrome' || browser === 'edge') {
      return <DesktopInstructions />;
    }

    // Unsupported desktop browser
    return <UnsupportedBrowser />;
  };

  const showInstallButton = deferredPrompt && (browser === 'chrome' || browser === 'edge');

  return (
    <Dialog open={isSheetOpen} onOpenChange={setSheetOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install Kilo Tracker</DialogTitle>
          <DialogDescription>
            Install Kilo Tracker as a desktop app for quick access and offline support.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">{renderInstructions()}</div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => dismissPrompt()}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          {showInstallButton && (
            <Button onClick={triggerNativeInstall} className="w-full sm:w-auto">
              Install Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
