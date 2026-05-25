import React from 'react';
import { getCategoriesAction } from '@/actions/categoryActions';
import CategoryManager from '@/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
  const res = await getCategoriesAction();
  const categories = res.success && res.categories ? res.categories : [];

  return <CategoryManager categories={categories} />;
}
