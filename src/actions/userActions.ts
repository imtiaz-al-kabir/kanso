'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function getUsersAction() {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      users: users.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      })),
    };
  } catch (error: any) {
    console.error('getUsersAction error:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function updateUserRoleAction(userId: string, role: 'customer' | 'admin') {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    // Safeguard: Do not allow the active admin to demote themselves
    if (auth.id === userId && role !== 'admin') {
      return { success: false, error: 'Cannot demote your own admin account. Please have another admin do this.' };
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.role = role;
    await user.save();

    revalidatePath('/admin/users');

    return { success: true };
  } catch (error: any) {
    console.error('updateUserRoleAction error:', error);
    return { success: false, error: error.message || 'Failed to update user role' };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    // Safeguard: Do not allow active admin to delete themselves
    if (auth.id === userId) {
      return { success: false, error: 'Cannot delete your own admin account.' };
    }

    await connectDB();

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/admin/users');

    return { success: true };
  } catch (error: any) {
    console.error('deleteUserAction error:', error);
    return { success: false, error: error.message || 'Failed to delete user' };
  }
}
