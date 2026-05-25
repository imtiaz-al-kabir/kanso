'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/auth';
import { CategorySchema } from '@/validations';

export async function getCategoriesAction() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    return {
      success: true,
      categories: categories.map((cat: any) => ({
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
      })),
    };
  } catch (error: any) {
    console.error('getCategoriesAction error:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function createCategoryAction(values: any) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();

    const validated = CategorySchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { name, description, image } = validated.data;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return { success: false, error: 'A category with this name already exists' };
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return {
      success: true,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
      },
    };
  } catch (error: any) {
    console.error('createCategoryAction error:', error);
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

export async function updateCategoryAction(id: string, values: any) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();

    const validated = CategorySchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { name, description, image } = validated.data;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, image },
      { new: true }
    );

    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('updateCategoryAction error:', error);
    return { success: false, error: error.message || 'Failed to update category' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('deleteCategoryAction error:', error);
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}
