'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Mail, Phone, Lock } from 'lucide-react';
import type { AuthUser } from '@/lib/auth';
import { updateProfileAction, changePasswordAction } from '@/actions/profileActions';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import ProfileLogoutButton from './ProfileLogoutButton';

function avatarDisplayUrl(url: string, cacheKey: number) {
  if (!url || url.startsWith('blob:')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}t=${cacheKey}`;
}

interface ProfileEditorClientProps {
  user: AuthUser;
}

const inputClass =
  'w-full bg-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm text-charcoal outline-none focus:border-charcoal transition-colors';

const labelClass = 'text-[9px] font-bold uppercase tracking-wider text-stone-400';

export function ProfileEditorClient({ user }: ProfileEditorClientProps) {
  const router = useRouter();
  const toast = useToast();
  const { setUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [avatarCacheKey, setAvatarCacheKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setName(user.name);
    setPhone(user.phone || '');
    setAvatar(user.avatar || '');
    setAvatarCacheKey((k) => k + 1);
  }, [user.name, user.phone, user.avatar]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const initials = user.name.charAt(0).toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast('Please choose an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be under 5MB', 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setAvatar(user.avatar || '');
        toast(data.error || 'Upload failed', 'error');
        return;
      }

      const imageUrl = data.url as string;
      setAvatar(imageUrl);

      const saveRes = await updateProfileAction({ name, avatar: imageUrl, phone });
      if (saveRes.success && saveRes.user) {
        setUser(saveRes.user);
        setAvatar(saveRes.user.avatar || imageUrl);
        setAvatarCacheKey((k) => k + 1);
        toast('Profile photo updated', 'success');
        router.refresh();
      } else {
        toast(saveRes.error || 'Photo uploaded — tap Save Profile to keep it', 'error');
      }
    } catch {
      setAvatar(user.avatar || '');
      toast('Upload failed. Please try again.', 'error');
    } finally {
      URL.revokeObjectURL(previewUrl);
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateProfileAction({ name, avatar, phone });
    setIsSaving(false);

    if (res.success && res.user) {
      setUser(res.user);
      setAvatar(res.user.avatar || '');
      setAvatarCacheKey((k) => k + 1);
      toast('Profile updated', 'success');
      router.refresh();
    } else {
      toast(res.error || 'Update failed', 'error');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      const msg = 'Please fill in all password fields';
      setPasswordError(msg);
      toast(msg, 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        toast('Password updated successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const msg = res.error || 'Could not change password';
        setPasswordError(msg);
        toast(msg, 'error');
      }
    } catch {
      const msg = 'Something went wrong. Please try again.';
      setPasswordError(msg);
      toast(msg, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto font-sans pb-8">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">
          Account
        </span>
        <h1 className="font-serif text-3xl font-light text-charcoal tracking-tight">My Profile</h1>
        <p className="text-xs text-stone-500 font-light">
          Update your photo, contact details, or password below.
        </p>
      </div>

      <form
        onSubmit={handleProfileSubmit}
        className="glass-panel rounded-2xl border border-charcoal/5 p-6 flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-charcoal/10 bg-sand shrink-0 group cursor-pointer disabled:opacity-60"
            aria-label="Change profile photo"
          >
            {avatar ? (
              <img
                key={avatarDisplayUrl(avatar, avatarCacheKey)}
                src={avatarDisplayUrl(avatar, avatarCacheKey)}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center font-bold text-2xl text-charcoal bg-primary/30">
                {initials}
              </span>
            )}
            <span className="absolute inset-0 bg-charcoal/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {isUploading ? 'Uploading…' : 'Tap photo to change'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Mobile number</span>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01711234567"
                autoComplete="tel"
                className={`${inputClass} pl-10`}
              />
            </div>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>Email</span>
            <p className="flex items-center gap-2 text-sm text-stone-500 bg-stone-50 border border-charcoal/5 rounded-xl px-4 py-3">
              <Mail className="w-4 h-4 shrink-0 text-stone-400" />
              {user.email}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="w-full py-3.5 rounded-xl bg-charcoal text-[#FAF9F6] text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="glass-panel rounded-2xl border border-charcoal/5 p-6 flex flex-col gap-5"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-stone-400" />
          <h2 className="font-serif text-lg font-light text-charcoal">Change password</h2>
        </div>

        {passwordError ? (
          <p
            role="alert"
            className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 font-medium"
          >
            {passwordError}
          </p>
        ) : null}

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="w-full py-3.5 rounded-xl border border-charcoal/15 bg-white text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-sand/80 transition-colors cursor-pointer disabled:opacity-60"
        >
          {isChangingPassword ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <ProfileLogoutButton />
    </div>
  );
}

export default ProfileEditorClient;
