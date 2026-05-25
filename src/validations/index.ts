import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  price: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().nonnegative('Original price cannot be negative').optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'Please provide at least one product image'),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  countInStock: z.number().int().nonnegative('Stock count cannot be negative'),
  variants: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters long'),
  description: z.string().optional().or(z.literal('')),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const OrderSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  city: z.string().min(2, 'City must be at least 2 characters long'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters long'),
  country: z.string().min(2, 'Country must be at least 2 characters long'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits long'),
  paymentMethod: z.enum(['COD', 'WhatsApp']),
  items: z.array(
    z.object({
      product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
      name: z.string(),
      image: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      variant: z.string().optional(),
    })
  ).min(1, 'Your cart is empty'),
});

export const ReviewSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Comment must be at least 3 characters long'),
});
