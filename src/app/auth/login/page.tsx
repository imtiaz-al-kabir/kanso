'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { loginAction } from '@/actions/authActions';
import { useToast } from '@/providers/ToastProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await loginAction({ email, password });
    setIsSubmitting(false);

    if (res.success) {
      toast(`Welcome back, ${res.user?.name}!`, 'success');
      router.refresh();
      // If user is an admin, redirect to admin panel, otherwise home
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      toast(res.error || 'Authentication failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 animate-fade-up font-sans">
      <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-charcoal/5">
        {/* Header */}
        <div className="flex flex-col gap-1.5 text-center">
          <span className="text-[9px] tracking-[0.3em] font-bold text-stone-400 uppercase">Secure Portal</span>
          <h1 className="font-serif text-2xl font-light text-charcoal">Sign In to KANSO</h1>
          <p className="text-[11px] text-stone-400 font-light leading-relaxed">
            Welcome back to your curated space.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-4 flex items-center justify-center gap-2 group"
            >
              Access Account
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </form>

        <hr className="border-charcoal/5" />

        {/* Footer */}
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs text-stone-500 font-light">
            New to KANSO?{' '}
            <Link
              href="/auth/register"
              className="font-bold text-charcoal hover:underline hover:text-stone-800 transition-colors"
            >
              Create an account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            <span>Encrypted Cookie Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
