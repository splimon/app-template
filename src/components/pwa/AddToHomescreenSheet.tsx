'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePWA } from '@/hooks/contexts/PWAContext';
import { IOSSafariInstructions } from './instructions/IOSSafariInstructions';
import { IOSOtherBrowserMessage } from './instructions/IOSOtherBrowserMessage';
import { AndroidChromeInstructions } from './instructions/AndroidChromeInstructions';
import { AndroidSamsungInstructions } from './instructions/AndroidSamsungInstructions';
import { UnsupportedBrowser } from './instructions/UnsupportedBrowser';

export function AddToHomescreenSheet() {
  const { isSheetOpen, setSheetOpen, platform, browser, dismissPrompt, deferredPrompt, triggerNativeInstall } = usePWA();

  const renderInstructions = () => {
    // iOS Safari
    if (platform === 'ios' && browser === 'safari') {
      return <IOSSafariInstructions />;
    }

    // iOS Chrome/Firefox - needs Safari
    if (platform === 'ios' && (browser === 'chrome' || browser === 'firefox')) {
      return <IOSOtherBrowserMessage />;
    }

    // Android Chrome
    if (platform === 'android' && browser === 'chrome') {
      return <AndroidChromeInstructions />;
    }

    // Android Samsung Internet
    if (platform === 'android' && browser === 'samsung') {
      return <AndroidSamsungInstructions />;
    }

    // Unsupported browser
    return <UnsupportedBrowser />;
  };

  const showInstallButton =
    deferredPrompt && platform === 'android' && browser === 'chrome';

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85vh] flex flex-col"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Install Kilo Tracker</SheetTitle>
          <SheetDescription>
            Add Kilo Tracker to your home screen for quick access and a better experience.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-4">{renderInstructions()}</div>
        </ScrollArea>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          {showInstallButton && (
            <Button onClick={triggerNativeInstall} className="w-full">
              Install Now
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => dismissPrompt()}
            className="w-full"
          >
            Maybe Later
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
