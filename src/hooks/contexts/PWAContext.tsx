'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { usePWADetection, Platform, Browser } from '@/hooks/usePWADetection';

// BeforeInstallPromptEvent interface for TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  // Detection
  platform: Platform;
  browser: Browser;
  iosVersion: number | null;
  isStandalone: boolean;
  isInstallable: boolean;

  // Native prompt (Chrome/Edge)
  deferredPrompt: BeforeInstallPromptEvent | null;
  triggerNativeInstall: () => Promise<boolean>;

  // UI state
  isSheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;

  // Dismissal
  hasUserDismissed: boolean;
  dismissPrompt: (days?: number) => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

const STORAGE_KEY_DISMISSED = 'kilo-pwa-dismissed';
const STORAGE_KEY_EXPIRY = 'kilo-pwa-dismissal-expiry';
const DEFAULT_DISMISSAL_DAYS = 7;

function getInitialDismissalState(): boolean {
  if (typeof window === 'undefined') return false;

  const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
  const expiry = localStorage.getItem(STORAGE_KEY_EXPIRY);

  if (dismissed === 'true' && expiry) {
    const expiryDate = new Date(expiry);
    if (expiryDate > new Date()) {
      return true;
    } else {
      // Expiry passed, clear the dismissal
      localStorage.removeItem(STORAGE_KEY_DISMISSED);
      localStorage.removeItem(STORAGE_KEY_EXPIRY);
    }
  }
  return false;
}

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const detection = usePWADetection();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [hasUserDismissed, setHasUserDismissed] = useState(getInitialDismissalState);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also listen for app installed event
    const installedHandler = () => {
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const triggerNativeInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferred prompt regardless of outcome
      setDeferredPrompt(null);

      return outcome === 'accepted';
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback((days: number = DEFAULT_DISMISSAL_DAYS) => {
    if (typeof window === 'undefined') return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    localStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
    localStorage.setItem(STORAGE_KEY_EXPIRY, expiryDate.toISOString());
    setHasUserDismissed(true);
    setSheetOpen(false);
  }, []);

  // Determine if the app is installable
  const isInstallable = useMemo(() => {
    // Not installable if already in standalone mode
    if (detection.isStandalone) return false;

    // iOS Safari can install
    if (detection.platform === 'ios' && detection.browser === 'safari') return true;

    // Android Chrome/Samsung can install
    if (
      detection.platform === 'android' &&
      (detection.browser === 'chrome' || detection.browser === 'samsung')
    ) {
      return true;
    }

    // Desktop Chrome/Edge with native prompt
    if (
      detection.platform === 'desktop' &&
      (detection.browser === 'chrome' || detection.browser === 'edge')
    ) {
      return true;
    }

    return false;
  }, [detection.isStandalone, detection.platform, detection.browser]);

  const value: PWAContextType = useMemo(() => ({
    platform: detection.platform,
    browser: detection.browser,
    iosVersion: detection.iosVersion,
    isStandalone: detection.isStandalone,
    isInstallable,
    deferredPrompt,
    triggerNativeInstall,
    isSheetOpen,
    setSheetOpen,
    hasUserDismissed,
    dismissPrompt,
  }), [
    detection.platform,
    detection.browser,
    detection.iosVersion,
    detection.isStandalone,
    isInstallable,
    deferredPrompt,
    triggerNativeInstall,
    isSheetOpen,
    hasUserDismissed,
    dismissPrompt,
  ]);

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
