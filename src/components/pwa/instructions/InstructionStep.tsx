'use client';

import { LucideIcon } from 'lucide-react';

interface InstructionStepProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function InstructionStep({
  stepNumber,
  icon: Icon,
  title,
  description,
}: InstructionStepProps) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
        {stepNumber}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
