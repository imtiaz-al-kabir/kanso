'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { loginAction } from '@/actions/authActions';
import { useToast } from '@/providers/ToastProvider';
import { getPostLoginPath } from '@/lib/authUrls';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      const msg = 'Please fill in all fields';
      setError(msg);
      toast(msg, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginAction({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res?.success) {
        const msg = res?.error || 'Authentication failed';
        setError(msg);
        toast(msg, 'error');
        return;
      }

      toast(`Welcome back, ${res.user?.name}!`, 'success');
      const destination = getPostLoginPath(callbackUrl, res.user?.role);
      // Full navigation ensures the new session cookie is sent on the next request
      window.location.assign(destination);
    } catch {
      const msg = 'Something went wrong. Please try again.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 animate-fade-up font-sans">
      <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-charcoal/5">
        <div className="flex flex-col gap-1.5 text-center">
          <span className="text-[9px] tracking-[0.3em] font-bold text-stone-400 uppercase">Secure Portal</span>
          <h1 className="font-serif text-2xl font-light text-charcoal">Sign In to KANSO</h1>
          <p className="text-[11px] text-stone-400 font-light leading-relaxed">
            {callbackUrl === '/profile'
              ? 'Sign in to view and edit your profile.'
              : 'Welcome back to your curated space.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error ? (
            <p
              role="alert"
              className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 font-medium"
            >
              {error}
            </p>
          ) : null}

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
              disabled={isSubmitting}
              className="w-full py-4 flex items-center justify-center gap-2 group"
            >
              Access Account
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </form>

        <hr className="border-charcoal/5" />

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

export default LoginForm;
