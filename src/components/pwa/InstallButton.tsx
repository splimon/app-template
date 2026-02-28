'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/contexts/PWAContext';

export function InstallButton() {
  const { isStandalone, isInstallable, setSheetOpen } = usePWA();

  // Don't render if already installed or not installable
  if (isStandalone || !isInstallable) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSheetOpen(true)}
      className="hidden sm:flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      <span>Install</span>
    </Button>
  );
}
