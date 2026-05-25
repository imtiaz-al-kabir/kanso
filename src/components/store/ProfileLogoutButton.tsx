'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/actions/authActions';

export function ProfileLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await logoutAction();
        router.push('/');
        router.refresh();
      }}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 bg-red-50/50 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}

export default ProfileLogoutButton;
