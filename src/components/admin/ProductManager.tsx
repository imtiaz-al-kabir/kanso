'use client';

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, Trash2, Box, Info, Check, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { createProductAction, updateProductAction, deleteProductAction } from '@/actions/productActions';
import ImageUpload from './ImageUpload';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  category: { id: string; name: string; slug: string } | null;
  countInStock: number;
  variants: string[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  featuredImage: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductManagerProps {
  products: ProductItem[];
  categories: CategoryItem[];
}

export function ProductManager({ products, categories }: ProductManagerProps) {
  const router = useRouter();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [variantsText, setVariantsText] = useState(''); // Comma separated sizes/colors
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    if (categories.length === 0) {
      toast('Please create at least one category before adding products', 'error');
      return;
    }
    setName('');
    setDescription('');
    setPrice(0);
    setOriginalPrice(0);
    setCountInStock(10);
    setCategoryId(categories[0]?.id || '');
    setImages([]);
    setVariantsText('');
    setIsFeatured(false);
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || 0);
    setCountInStock(prod.countInStock);
    setCategoryId(prod.category ? prod.category.id : categories[0]?.id || '');
    setImages(prod.images || []);
    setVariantsText(prod.variants ? prod.variants.join(', ') : '');
    setIsFeatured(prod.isFeatured || false);
    setEditingId(prod.id);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast('Product name is required', 'error');
    if (!description.trim()) return toast('Description is required', 'error');
    if (price <= 0) return toast('Price must be greater than 0', 'error');
    if (images.length === 0) return toast('Please provide at least one product image', 'error');
    if (!categoryId) return toast('Category is required', 'error');

    setIsSubmitting(true);

    const variants = variantsText
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const payload = {
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      countInStock: Number(countInStock),
      category: categoryId,
      images,
      variants,
      isFeatured,
      featuredImage: images[0] || '', // Use primary image as featured preview
    };

    let res;
    if (isEditing) {
      res = await updateProductAction(editingId, payload);
    } else {
      res = await createProductAction(payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      toast(isEditing ? 'Product updated successfully' : 'Product created successfully', 'success');
      setIsOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Failed to submit product data', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action is permanent.')) {
      return;
    }

    const res = await deleteProductAction(id);
    if (res.success) {
      toast('Product deleted successfully', 'success');
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-light text-charcoal">Manage Products</h2>
          <p className="text-xs text-stone-500 font-light">Audit your luxury stoneware catalog and stocks.</p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2 text-xs py-2 px-4">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products table */}
      {products.length > 0 ? (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xs border border-charcoal/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand border-b border-charcoal/5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-stone-600 divide-y divide-charcoal/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-sand/35 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      {/* Image preview */}
                      <div
                        className="w-10 h-10 rounded-lg bg-cover bg-center bg-sand shrink-0 shadow-xs border border-charcoal/5"
                        style={{ backgroundImage: `url('${prod.images[0]}')` }}
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-charcoal font-serif text-sm font-semibold truncate max-w-[150px]">
                          {prod.name}
                        </span>
                        <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wider truncate max-w-[120px]">
                          slug: {prod.slug}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-stone-500">
                      {prod.category ? prod.category.name : <span className="italic text-stone-400">None</span>}
                    </td>
                    <td className="p-4 font-sans text-xs font-bold text-charcoal">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                          prod.countInStock === 0
                            ? 'bg-red-50 text-red-600'
                            : prod.countInStock < 5
                            ? 'bg-yellow-50 text-yellow-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {prod.countInStock === 0 ? 'Out of stock' : `${prod.countInStock} items`}
                      </span>
                    </td>
                    <td className="p-4">
                      {prod.isFeatured ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-stone-300 font-light">-</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="flex items-center justify-center p-2 rounded-lg border border-charcoal/15 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-all cursor-pointer active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="flex items-center justify-center p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all cursor-pointer active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <Box className="w-8 h-8 text-stone-400" />
          <h3 className="font-serif text-sm font-semibold text-charcoal">No Products Showcase</h3>
          <p className="text-xs text-stone-400 font-light max-w-xs leading-relaxed">
            Your stoneware collection is currently empty. Get started by adding a premium handcrafted piece.
          </p>
          <Button onClick={handleOpenCreate} variant="outline" size="sm" className="mt-2">
            Create First Product
          </Button>
        </div>
      )}

      {/* CRUD Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditing ? 'Edit Product' : 'Create Product'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Title"
              placeholder="e.g. Hasu Lounge Chair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5 font-sans">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Showcase Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full bg-sand/40 border border-charcoal/5 px-4 py-3 rounded-lg text-xs font-semibold text-charcoal focus:outline-none focus:border-charcoal focus:bg-sand cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price ($)"
              type="number"
              placeholder="890"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />

            <Input
              label="Original Price ($) - Optional"
              type="number"
              placeholder="1100"
              value={originalPrice || ''}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
            />

            <Input
              label="Quantity in Stock"
              type="number"
              placeholder="10"
              value={countInStock || ''}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              required
            />

            <Input
              label="Variants / Styles (Comma Separated)"
              placeholder="e.g. Ash White Oak, Charcoal Oak"
              value={variantsText}
              onChange={(e) => setVariantsText(e.target.value)}
            />
          </div>

          <Textarea
            label="Product Description"
            placeholder="Tell the story of this organic design, texture, and spacing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Cloudinary Drag & Drop Uploader */}
          <ImageUpload value={images} onChange={(urls) => setImages(urls)} />

          {/* Featured toggle */}
          <div className="flex items-center gap-3 bg-sand/45 p-4 rounded-xl border border-charcoal/5 select-none">
            <input
              type="checkbox"
              id="isFeaturedToggle"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-charcoal focus:ring-charcoal cursor-pointer"
            />
            <label htmlFor="isFeaturedToggle" className="flex flex-col cursor-pointer">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wide">Feature in Hero Carousel</span>
              <span className="text-[10px] text-stone-400 font-light mt-0.5">
                Displays this showcase item on the storefront home list.
              </span>
            </label>
          </div>

          {/* Form CTA */}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Publish Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProductManager;
