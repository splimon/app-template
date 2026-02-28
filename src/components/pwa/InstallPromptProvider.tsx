'use client';

import { useEffect, useRef, useState } from 'react';
import { usePWA } from '@/hooks/contexts/PWAContext';
import { useAuth } from '@/hooks/contexts/AuthContext';
import { AddToHomescreenSheet } from './AddToHomescreenSheet';
import { AddToHomescreenDialog } from './AddToHomescreenDialog';

const VISIT_COUNT_KEY = 'kilo-pwa-visit-count';
const ENGAGEMENT_THRESHOLD = 1; // Show on first visit for better UX
const PROMPT_DELAY_MS = 2000;

// Set to true to show debug panel, false for production
const SHOW_DEBUG_PANEL = true;

function DebugPanel() {
  const { platform, browser, iosVersion, isStandalone, isInstallable, hasUserDismissed, setSheetOpen } = usePWA();
  const { isAuthenticated } = useAuth();
  const [userAgent, setUserAgent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  if (!SHOW_DEBUG_PANEL) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-[90vw]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-black text-white text-xs px-2 py-1 rounded-t font-mono"
      >
        PWA Debug {isExpanded ? '▼' : '▲'}
      </button>
      {isExpanded && (
        <div className="bg-black/90 text-white text-xs p-3 rounded-b font-mono space-y-1 max-h-[50vh] overflow-auto">
          <div><span className="text-gray-400">Platform:</span> <span className={platform === 'ios' ? 'text-green-400' : 'text-yellow-400'}>{platform}</span></div>
          <div><span className="text-gray-400">Browser:</span> <span className={browser === 'safari' ? 'text-green-400' : 'text-yellow-400'}>{browser}</span></div>
          <div><span className="text-gray-400">iOS Ver:</span> {iosVersion ?? 'N/A'}</div>
          <div><span className="text-gray-400">Standalone:</span> <span className={isStandalone ? 'text-red-400' : 'text-green-400'}>{String(isStandalone)}</span></div>
          <div><span className="text-gray-400">Installable:</span> <span className={isInstallable ? 'text-green-400' : 'text-red-400'}>{String(isInstallable)}</span></div>
          <div><span className="text-gray-400">Dismissed:</span> <span className={hasUserDismissed ? 'text-red-400' : 'text-green-400'}>{String(hasUserDismissed)}</span></div>
          <div><span className="text-gray-400">Auth:</span> <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(isAuthenticated)}</span></div>
          <div className="pt-2 border-t border-gray-600">
            <span className="text-gray-400">UA:</span>
            <div className="text-[10px] break-all text-gray-300">{userAgent}</div>
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="mt-2 w-full bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Force Open Sheet
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('kilo-pwa-dismissed');
              localStorage.removeItem('kilo-pwa-dismissal-expiry');
              localStorage.removeItem(VISIT_COUNT_KEY);
              window.location.reload();
            }}
            className="mt-1 w-full bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Clear PWA Storage & Reload
          </button>
        </div>
      )}
    </div>
  );
}

export function InstallPromptProvider() {
  const { isStandalone, isInstallable, hasUserDismissed, setSheetOpen, platform } = usePWA();
  const hasTriggeredPrompt = useRef(false);

  // Track visits and check engagement threshold
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip all logic if already installed
    if (isStandalone) return;

    // Skip if not installable
    if (!isInstallable) return;

    // Skip if user has dismissed
    if (hasUserDismissed) return;

    // Prevent triggering multiple times
    if (hasTriggeredPrompt.current) return;

    // Increment visit count
    const currentCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    const newCount = currentCount + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(newCount));

    // Check if we've hit the engagement threshold
    if (newCount >= ENGAGEMENT_THRESHOLD) {
      hasTriggeredPrompt.current = true;

      // Delay showing the prompt
      const timer = setTimeout(() => {
        setSheetOpen(true);
      }, PROMPT_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, [isStandalone, isInstallable, hasUserDismissed, setSheetOpen]);

  // Don't render anything if already installed
  if (isStandalone) {
    return null;
  }

  // Render the appropriate UI based on platform
  return (
    <>
      <DebugPanel />
      {platform === 'desktop' ? <AddToHomescreenDialog /> : <AddToHomescreenSheet />}
    </>
  );
}
