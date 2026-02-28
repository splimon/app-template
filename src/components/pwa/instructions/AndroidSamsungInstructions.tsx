'use client';

import { Menu, Home, Smartphone } from 'lucide-react';
import { InstructionStep } from './InstructionStep';

export function AndroidSamsungInstructions() {
  return (
    <div className="space-y-3">
      <InstructionStep
        stepNumber={1}
        icon={Menu}
        title="Tap the menu button"
        description="Look for the three horizontal lines (hamburger menu) at the bottom of your screen"
      />
      <InstructionStep
        stepNumber={2}
        icon={Home}
        title='Tap "Add page to" then "Home screen"'
        description="Select the Home screen option from the submenu"
      />
      <InstructionStep
        stepNumber={3}
        icon={Smartphone}
        title="Confirm"
        description="Tap Add or the checkmark to confirm adding to your home screen"
      />
    </div>
  );
}
