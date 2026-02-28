'use client';

import { Share, SquarePlus, Smartphone, MoreHorizontal } from 'lucide-react';
import { InstructionStep } from './InstructionStep';
import { usePWA } from '@/hooks/contexts/PWAContext';

export function IOSSafariInstructions() {
  const { iosVersion } = usePWA();
  const isIOS18Plus = iosVersion !== null && iosVersion >= 18;

  // iOS 18+ has a new Safari UI with 3-dot menu containing the Share option
  if (isIOS18Plus) {
    return (
      <div className="space-y-3">
        <InstructionStep
          stepNumber={1}
          icon={MoreHorizontal}
          title="Tap the 3-dot menu"
          description="Look for the three horizontal dots (•••) in the address bar"
        />
        <InstructionStep
          stepNumber={2}
          icon={Share}
          title='Tap "Share..."'
          description="Find the Share option in the menu that appears"
        />
        <InstructionStep
          stepNumber={3}
          icon={SquarePlus}
          title='Tap "Add to Home Screen"'
          description="Scroll down in the share menu to find this option"
        />
        <InstructionStep
          stepNumber={4}
          icon={Smartphone}
          title='Tap "Add"'
          description="Confirm by tapping Add in the top-right corner"
        />
      </div>
    );
  }

  // iOS 17 and earlier - Share button is directly visible
  return (
    <div className="space-y-3">
      <InstructionStep
        stepNumber={1}
        icon={Share}
        title="Tap the Share button"
        description="Look for the square with an upward arrow at the bottom of your screen"
      />
      <InstructionStep
        stepNumber={2}
        icon={SquarePlus}
        title='Tap "Add to Home Screen"'
        description="Scroll down in the share menu to find this option"
      />
      <InstructionStep
        stepNumber={3}
        icon={Smartphone}
        title='Tap "Add"'
        description="Confirm by tapping Add in the top-right corner"
      />
    </div>
  );
}
