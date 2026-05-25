'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getAuthUser, comparePassword, hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ProfileUpdateSchema, ChangePasswordSchema } from '@/validations';

function normalizePhone(phone: string) {
  return phone.trim();
}

function isValidPhone(phone: string) {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export async function updateProfileAction(data: { name: string; avatar?: string; phone?: string }) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return { success: false, error: 'Please sign in to update your profile.' };
    }

    const validated = ProfileUpdateSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const phone = normalizePhone(validated.data.phone ?? '');
    if (!isValidPhone(phone)) {
      return { success: false, error: 'Enter a valid mobile number (at least 8 digits).' };
    }

    await connectDB();

    const update = {
      name: validated.data.name.trim(),
      phone,
      avatar: validated.data.avatar ?? '',
    };

    await User.findByIdAndUpdate(
      auth.id,
      { $set: update },
      { runValidators: true }
    );

    revalidatePath('/profile');
    revalidatePath('/', 'layout');

    return {
      success: true,
      user: {
        id: auth.id,
        name: update.name,
        email: auth.email,
        role: auth.role,
        avatar: update.avatar ?? auth.avatar ?? '',
        phone: update.phone,
      },
    };
  } catch (error: unknown) {
    console.error('updateProfileAction error:', error);
    return { success: false, error: 'Could not update profile. Please try again.' };
  }
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return { success: false, error: 'Please sign in to change your password.' };
    }

    const validated = ChangePasswordSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { currentPassword, newPassword } = validated.data;

    if (currentPassword === newPassword) {
      return { success: false, error: 'New password must be different from your current password.' };
    }

    await connectDB();
    const user = await User.findById(auth.id);
    if (!user) {
      return { success: false, error: 'Account not found.' };
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { success: true };
  } catch (error: unknown) {
    console.error('changePasswordAction error:', error);
    return { success: false, error: 'Could not change password. Please try again.' };
  }
}
