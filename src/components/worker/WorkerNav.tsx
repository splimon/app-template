'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface WorkerNavProps {
  tenantSlug: string;
}

export default function WorkerNav({ tenantSlug }: WorkerNavProps) {
  const pathname = usePathname();
  const base = `/t/${tenantSlug}/worker`;

  const isActive = (href: string) => {
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  const tabs = [
    { href: base, label: 'Kilo', icon: '🌿' },
    { href: `${base}/journey`, label: 'Journey', icon: '🗺️' },
    { href: `${base}/profile`, label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#111111] border-t border-[#333333] flex items-center z-50">
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-xl">{tab.icon}</span>
            <span
              className="text-xs font-medium"
              style={{ color: active ? '#C4622D' : '#6b7280' }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
