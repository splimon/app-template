'use client';

import { useSyncExternalStore } from 'react';

export type Platform = 'ios' | 'android' | 'desktop' | 'unknown';
export type Browser = 'safari' | 'chrome' | 'firefox' | 'samsung' | 'edge' | 'unknown';

export interface PWADetection {
  platform: Platform;
  browser: Browser;
  iosVersion: number | null;
  isStandalone: boolean;
  isIOSChrome: boolean;
  supportsNativeInstall: boolean;
}

function detectPlatform(userAgent: string): Platform {
  // Check for iOS (including iPad with desktop mode)
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }

  // Check for iPad that reports as Mac (iOS 13+)
  if (
    userAgent.includes('Mac') &&
    typeof navigator !== 'undefined' &&
    'maxTouchPoints' in navigator &&
    navigator.maxTouchPoints > 1
  ) {
    return 'ios';
  }

  if (/Android/.test(userAgent)) {
    return 'android';
  }

  // Desktop detection
  if (/Windows|Mac|Linux/.test(userAgent) && !/Android/.test(userAgent)) {
    return 'desktop';
  }

  return 'unknown';
}

function detectBrowser(userAgent: string, platform: Platform): Browser {
  // On iOS, Chrome and Firefox use WebKit, but we can detect them
  const isIOSChrome = platform === 'ios' && /CriOS/.test(userAgent);
  const isIOSFirefox = platform === 'ios' && /FxiOS/.test(userAgent);

  if (isIOSChrome) return 'chrome';
  if (isIOSFirefox) return 'firefox';

  // True Safari: only on Apple devices, not Chrome/Firefox
  if (
    /Safari/.test(userAgent) &&
    !/Chrome/.test(userAgent) &&
    !/CriOS/.test(userAgent) &&
    !/FxiOS/.test(userAgent) &&
    !/Edg/.test(userAgent)
  ) {
    return 'safari';
  }

  // Samsung Internet
  if (/SamsungBrowser/.test(userAgent)) {
    return 'samsung';
  }

  // Edge (Chromium-based)
  if (/Edg/.test(userAgent)) {
    return 'edge';
  }

  // Chrome (not on iOS)
  if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) {
    return 'chrome';
  }

  // Firefox (not on iOS)
  if (/Firefox/.test(userAgent) && !/FxiOS/.test(userAgent)) {
    return 'firefox';
  }

  return 'unknown';
}

function detectIOSVersion(userAgent: string): number | null {
  const match = userAgent.match(/OS (\d+)_/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  // iOS standalone mode
  if ('standalone' in window.navigator) {
    return (window.navigator as { standalone?: boolean }).standalone === true;
  }

  // Android/Desktop PWA via display-mode media query
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Also check for fullscreen mode (some PWAs use this)
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return true;
  }

  return false;
}

function getClientDetection(): PWADetection {
  const userAgent = navigator.userAgent;
  const platform = detectPlatform(userAgent);
  const browser = detectBrowser(userAgent, platform);
  const iosVersion = platform === 'ios' ? detectIOSVersion(userAgent) : null;
  const isStandalone = detectStandalone();
  const isIOSChrome = platform === 'ios' && browser === 'chrome';

  // Native install prompt is supported in Chrome and Edge on Android/Desktop
  const supportsNativeInstall =
    !isStandalone &&
    (browser === 'chrome' || browser === 'edge') &&
    platform !== 'ios';

  return {
    platform,
    browser,
    iosVersion,
    isStandalone,
    isIOSChrome,
    supportsNativeInstall,
  };
}

const serverSnapshot: PWADetection = {
  platform: 'unknown',
  browser: 'unknown',
  iosVersion: null,
  isStandalone: false,
  isIOSChrome: false,
  supportsNativeInstall: false,
};

// Cache the detection result since it won't change during the session
let cachedDetection: PWADetection | null = null;

function subscribe() {
  // Detection values don't change, no need to subscribe to anything
  return () => {};
}

function getSnapshot(): PWADetection {
  if (cachedDetection === null) {
    cachedDetection = getClientDetection();
  }
  return cachedDetection;
}

function getServerSnapshot(): PWADetection {
  return serverSnapshot;
}

export function usePWADetection(): PWADetection {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
