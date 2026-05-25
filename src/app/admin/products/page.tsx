import React from 'react';
import { getCategoriesAction } from '@/actions/categoryActions';
import { getProductsAction } from '@/actions/productActions';
import ProductManager from '@/components/admin/ProductManager';

export default async function AdminProductsPage() {
  const catRes = await getCategoriesAction();
  const prodRes = await getProductsAction();

  const categories = catRes.success && catRes.categories ? catRes.categories : [];
  const products = prodRes.success && prodRes.products ? prodRes.products : [];

  return (
    <ProductManager
      products={products as any}
      categories={categories}
    />
  );
}
