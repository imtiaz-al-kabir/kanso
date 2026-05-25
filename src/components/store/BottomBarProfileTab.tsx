'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const LOGIN_HREF = '/auth/login?callbackUrl=/profile';

export function BottomBarProfileTab() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive =
    pathname === '/profile' || pathname.startsWith('/auth');

  const tabClass = `flex flex-col items-center justify-center gap-1 flex-1 min-w-0 min-h-[52px] relative z-10 transition-all duration-300 active:scale-95 touch-manipulation ${
    isActive ? 'text-charcoal scale-105' : 'text-stone-400'
  }`;

  if (!user) {
    return (
      <Link
        href={LOGIN_HREF}
        className={tabClass}
        aria-label="Sign in to profile"
      >
        <User className="w-[18px] h-[18px] shrink-0" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">
          Profile
        </span>
      </Link>
    );
  }

  const initials = user.name.charAt(0).toUpperCase();

  return (
    <Link
      href="/profile"
      className={tabClass}
      aria-label="My profile"
    >
      <div
        className={`w-7 h-7 rounded-full overflow-hidden border-2 shrink-0 ${
          isActive ? 'border-charcoal ring-2 ring-charcoal/15' : 'border-charcoal/15'
        }`}
      >
        {user.avatar ? (
          <img
            key={user.avatar}
            src={user.avatar}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-[10px] font-bold bg-primary/40 text-charcoal">
            {initials}
          </span>
        )}
      </div>
      <span className="text-[9px] font-sans font-bold uppercase tracking-wider">
        Profile
      </span>
    </Link>
  );
}

export default BottomBarProfileTab;
