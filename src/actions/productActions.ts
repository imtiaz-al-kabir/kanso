'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Review from '@/models/Review';
import { getAuthUser } from '@/lib/auth';
import { ProductSchema, ReviewSchema } from '@/validations';

export async function getProductsAction(filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
} = {}) {
  try {
    await connectDB();

    const query: any = {};

    // Search query
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      const cat = await Category.findOne({ slug: filters.category });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    // Sort order
    let sortOptions: any = { createdAt: -1 };
    if (filters.sort) {
      if (filters.sort === 'price-low') {
        sortOptions = { price: 1 };
      } else if (filters.sort === 'price-high') {
        sortOptions = { price: -1 };
      } else if (filters.sort === 'rating') {
        sortOptions = { rating: -1 };
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .lean();

    return {
      success: true,
      products: products.map((prod: any) => ({
        id: prod._id.toString(),
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice || null,
        images: prod.images,
        category: prod.category
          ? { id: prod.category._id.toString(), name: prod.category.name, slug: prod.category.slug }
          : null,
        countInStock: prod.countInStock,
        variants: prod.variants || [],
        rating: prod.rating || 0,
        numReviews: prod.numReviews || 0,
        isFeatured: prod.isFeatured || false,
        featuredImage: prod.featuredImage || '',
      })),
    };
  } catch (error: any) {
    console.error('getProductsAction error:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug }).populate('category', 'name slug').lean();
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Fetch related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: (product as any).category._id,
      _id: { $ne: (product as any)._id },
    })
      .limit(4)
      .lean();

    // Fetch reviews
    const reviews = await Review.find({ product: (product as any)._id })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      product: {
        id: (product as any)._id.toString(),
        name: (product as any).name,
        slug: (product as any).slug,
        description: (product as any).description,
        price: (product as any).price,
        originalPrice: (product as any).originalPrice || null,
        images: (product as any).images,
        category: (product as any).category
          ? {
              id: (product as any).category._id.toString(),
              name: (product as any).category.name,
              slug: (product as any).category.slug,
            }
          : null,
        countInStock: (product as any).countInStock,
        variants: (product as any).variants || [],
        rating: (product as any).rating || 0,
        numReviews: (product as any).numReviews || 0,
        isFeatured: (product as any).isFeatured || false,
        featuredImage: (product as any).featuredImage || '',
      },
      related: relatedProducts.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        price: p.price,
        images: p.images,
        rating: p.rating || 0,
      })),
      reviews: reviews.map((r: any) => ({
        id: r._id.toString(),
        username: r.username,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    console.error('getProductBySlugAction error:', error);
    return { success: false, error: 'Failed to fetch product details' };
  }
}

export async function createProductAction(values: any) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();

    const validated = ProductSchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { name, description, price, originalPrice, images, category, countInStock, variants, isFeatured, featuredImage } = validated.data;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Check slug uniqueness
    const existing = await Product.findOne({ slug });
    if (existing) {
      return { success: false, error: 'A product with this name already exists' };
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      originalPrice,
      images,
      category,
      countInStock,
      variants,
      isFeatured,
      featuredImage: featuredImage || '',
    });

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return {
      success: true,
      product: {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
      },
    };
  } catch (error: any) {
    console.error('createProductAction error:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProductAction(id: string, values: any) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();

    const validated = ProductSchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { name, description, price, originalPrice, images, category, countInStock, variants, isFeatured, featuredImage } = validated.data;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        price,
        originalPrice,
        images,
        category,
        countInStock,
        variants,
        isFeatured,
        featuredImage: featuredImage || '',
      },
      { new: true }
    );

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/admin/products');

    return { success: true };
  } catch (error: any) {
    console.error('updateProductAction error:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (error: any) {
    console.error('deleteProductAction error:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

export async function createReviewAction(values: any) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return { success: false, error: 'You must be logged in to post a review' };
    }

    await connectDB();

    const validated = ReviewSchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { productId, rating, comment } = validated.data;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ product: productId, user: auth.id });
    if (alreadyReviewed) {
      return { success: false, error: 'You have already reviewed this product' };
    }

    // Create review
    await Review.create({
      product: productId,
      user: auth.id,
      username: auth.name,
      rating,
      comment,
    });

    // Update product ratings average & count
    const productReviews = await Review.find({ product: productId });
    const numReviews = productReviews.length;
    const avgRating = productReviews.reduce((sum, item) => sum + item.rating, 0) / numReviews;

    product.numReviews = numReviews;
    product.rating = Number(avgRating.toFixed(1));
    await product.save();

    revalidatePath(`/product/${product.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error('createReviewAction error:', error);
    return { success: false, error: error.message || 'Failed to submit review' };
  }
}
