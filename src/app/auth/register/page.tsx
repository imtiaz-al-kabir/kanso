'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { registerAction } from '@/actions/authActions';
import { useToast } from '@/providers/ToastProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      toast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await registerAction({ name, email, password });
    setIsSubmitting(false);

    if (res.success) {
      toast(`Welcome, ${res.user?.name}! Your account has been created.`, 'success');
      router.refresh();
      // If the user gets the admin role (automatic first user), redirect to admin, else home
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      toast(res.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 animate-fade-up font-sans">
      <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-charcoal/5">
        {/* Header */}
        <div className="flex flex-col gap-1.5 text-center">
          <span className="text-[9px] tracking-[0.3em] font-bold text-stone-400 uppercase">Join Journal</span>
          <h1 className="font-serif text-2xl font-light text-charcoal">Create KANSO Account</h1>
          <p className="text-[11px] text-stone-400 font-light leading-relaxed">
            Register to save wishlists, view order history, and leave design feedback.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Your Name"
            type="text"
            placeholder="e.g. Imtiaz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

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
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-4 flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              Register Account
            </Button>
          </div>
        </form>

        <hr className="border-charcoal/5" />

        {/* Footer */}
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs text-stone-500 font-light">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-bold text-charcoal hover:underline hover:text-stone-800 transition-colors"
            >
              Sign In
            </Link>
          </p>
          
          {/* Developer privilege hint */}
          <div className="bg-primary/10 rounded-xl p-3 border border-primary/20 text-[10px] text-stone-600 font-light leading-relaxed">
            💡 **First account registered automatically obtains full Admin Dashboard access!**
          </div>

          <div className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            <span>Secure Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
