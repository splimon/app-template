'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { TenantContext as TenantContextType } from '@/types/tenant';

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: TenantContextType;
}) {
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextType {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used inside TenantProvider');
  return ctx;
}
