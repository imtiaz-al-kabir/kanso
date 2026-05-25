'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, comparePassword, signToken, setAuthCookie, removeAuthCookie } from '@/lib/auth';
import { LoginSchema, RegisterSchema } from '@/validations';

export async function loginAction(values: any) {
  try {
    await connectDB();

    // Validate inputs
    const validated = LoginSchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { email, password } = validated.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Sign and set token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);
    revalidatePath('/', 'layout');

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: unknown) {
    console.error('Login action error:', error);
    const message =
      error instanceof Error ? error.message : 'An error occurred during login';
    if (message.includes('ECONNREFUSED') || message.includes('MongoServerSelectionError')) {
      return { success: false, error: 'Cannot reach the database. Please try again shortly.' };
    }
    return { success: false, error: message };
  }
}

export async function registerAction(values: any) {
  try {
    await connectDB();

    // Validate inputs
    const validated = RegisterSchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { name, email, password } = validated.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    // The very first user will be an 'admin' for easier development & testing convenience!
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'customer';

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    // Sign and set token
    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    await setAuthCookie(token);

    return {
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error: any) {
    console.error('Register action error:', error);
    return { success: false, error: error.message || 'An error occurred during registration' };
  }
}

export async function logoutAction() {
  try {
    await removeAuthCookie();
    return { success: true };
  } catch (error: any) {
    console.error('Logout action error:', error);
    return { success: false, error: 'An error occurred during logout' };
  }
}
