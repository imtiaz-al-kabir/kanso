'use client';

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, Trash2, FolderPlus, Info } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/actions/categoryActions';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface CategoryManagerProps {
  categories: CategoryItem[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setName('');
    setDescription('');
    setImage('');
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setEditingId(cat.id);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Category name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    
    const payload = { name, description, image };
    
    let res;
    if (isEditing) {
      res = await updateCategoryAction(editingId, payload);
    } else {
      res = await createCategoryAction(payload);
    }
    
    setIsSubmitting(false);

    if (res.success) {
      toast(isEditing ? 'Category updated successfully' : 'Category created successfully', 'success');
      setIsOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated products may lose their category link.')) {
      return;
    }

    const res = await deleteCategoryAction(id);
    if (res.success) {
      toast('Category deleted successfully', 'success');
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top action block */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-light text-charcoal">Manage Categories</h2>
          <p className="text-xs text-stone-500 font-light">Add or configure your luxury showcase categories.</p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2 text-xs py-2 px-4">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Grid List */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative group shadow-xs">
              {/* Category Image Preview */}
              {cat.image ? (
                <div
                  className="h-28 w-full rounded-xl bg-cover bg-center shadow-inner"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
              ) : (
                <div className="h-28 w-full rounded-xl bg-sand border border-charcoal/5 flex items-center justify-center text-stone-400">
                  <FolderPlus className="w-8 h-8" />
                </div>
              )}

              {/* Title & Desc */}
              <div className="flex flex-col gap-1">
                <span className="font-serif text-base font-semibold text-charcoal">{cat.name}</span>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">slug: {cat.slug}</span>
                <p className="text-xs text-stone-500 font-light leading-relaxed truncate-2-lines mt-1">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-charcoal/5 pt-3">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="flex items-center justify-center p-2 rounded-lg border border-charcoal/15 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="flex items-center justify-center p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <Info className="w-8 h-8 text-stone-400" />
          <h3 className="font-serif text-sm font-semibold text-charcoal">No Categories Added</h3>
          <p className="text-xs text-stone-400 font-light max-w-xs leading-relaxed">
            Get started by adding categories (e.g. Furniture, Ceramics) to organize your catalog.
          </p>
          <Button onClick={handleOpenCreate} variant="outline" size="sm" className="mt-2">
            Create First Category
          </Button>
        </div>
      )}

      {/* CRUD Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditing ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Category Name"
            placeholder="e.g. Stoneware, Furniture"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Image Showcase URL (Optional)"
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <Textarea
            label="Category Description"
            placeholder="Detail the materials, philosophy, and collection..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CategoryManager;
