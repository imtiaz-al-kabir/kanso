import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Review from '@/models/Review';
import Order from '@/models/Order';
import Wishlist from '@/models/Wishlist';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();

    // 1. Wipe database logs
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Wishlist.deleteMany({});

    // 2. Seed Admin User
    const adminPassword = await hashPassword('password123');
    const adminUser = await User.create({
      name: 'Kanso Merchant Admin',
      email: 'admin@kanso.com',
      password: adminPassword,
      role: 'admin',
    });

    // Seed regular customer user
    const customerPassword = await hashPassword('password123');
    const customerUser = await User.create({
      name: 'Imtiaz Customer',
      email: 'imtiaz@example.com',
      password: customerPassword,
      role: 'customer',
    });

    // 3. Seed Categories
    const categoriesData = [
      {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Sculpted wooden frames & raw linen surfaces built to frame beautiful open spaces.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Ceramics',
        slug: 'ceramics',
        description: 'Handcrafted stoneware and volcanic clay glazed teaware designed for slow morning rituals.',
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Lighting',
        slug: 'lighting',
        description: 'Organic paper lanterns & subtle shadows filtering ambient diffuse warmth.',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    const furnitureCat = seededCategories.find(c => c.slug === 'furniture');
    const ceramicsCat = seededCategories.find(c => c.slug === 'ceramics');
    const lightingCat = seededCategories.find(c => c.slug === 'lighting');

    // 4. Seed Products
    const productsData = [
      {
        name: 'Hasu Lounge Chair',
        slug: 'hasu-lounge-chair',
        description: 'The Hasu Lounge Chair blends Scandinavian functionality with Japanese minimalism. Crafted with a solid sustainable solid oak frame and upholstered in a luxurious premium textured rough linen fabric. Features an angled silhouette designed for perfect ergonomic comfort and tactile reassurance.',
        price: 890,
        originalPrice: 1100,
        images: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
        ],
        category: furnitureCat?._id,
        countInStock: 8,
        variants: ['Ash White Oak', 'Charcoal Oak'],
        rating: 4.9,
        numReviews: 2,
        isFeatured: true,
      },
      {
        name: 'Enso Ceramic Tea Set',
        slug: 'enso-ceramic-tea-set',
        description: 'Hand-thrown clay teaware designed to honor the traditional tea rituals. Featuring a warm beige textured volcanic clay body, finished with a subtle semi-matte ivory glaze. Includes one tea kettle with organic woven rattan handle and four matching cups.',
        price: 180,
        originalPrice: 220,
        images: [
          'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'
        ],
        category: ceramicsCat?._id,
        countInStock: 15,
        variants: ['Sanded Beige', 'Volcanic Ash'],
        rating: 4.8,
        numReviews: 1,
        isFeatured: true,
      },
      {
        name: 'Kyoto Pendant Lantern',
        slug: 'kyoto-pendant-lantern',
        description: 'A beautiful atmospheric suspension light crafted from delicate, handmade organic mulberry paper over a thin structural bamboo rib framework. Spreads a soft, warm ambient diffuse glow, casting subtle line patterns onto nearby surfaces.',
        price: 340,
        originalPrice: 420,
        images: [
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'
        ],
        category: lightingCat?._id,
        countInStock: 3,
        variants: ['Washi Ivory', 'Sanded Sand'],
        rating: 5.0,
        numReviews: 2,
        isFeatured: true,
      },
      {
        name: 'Wabi Stoneware Vase',
        slug: 'wabi-stoneware-vase',
        description: 'An elegant textured volcanic stoneware vase. Modeled with irregular organic shapes celebrating wabi-sabi philosophy: the beauty found in natural aging, handcraft, and asymmetry.',
        price: 120,
        originalPrice: 150,
        images: [
          'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80'
        ],
        category: ceramicsCat?._id,
        countInStock: 12,
        variants: ['Volcanic Black', 'Chalk Clay'],
        rating: 4.7,
        numReviews: 1,
        isFeatured: true,
      },
    ];

    const seededProducts = await Product.insertMany(productsData);

    // 5. Seed Reviews
    const reviewsData = [
      {
        product: seededProducts[0]?._id,
        user: customerUser._id,
        username: customerUser.name,
        rating: 5,
        comment: 'Breathtaking build. The texture of the linen cushion feels incredibly premium and soft. Best lounge chair I have ever sat on.',
      },
      {
        product: seededProducts[0]?._id,
        user: adminUser._id,
        username: adminUser.name,
        rating: 4,
        comment: 'A true wabi-sabi masterpiece. The frame shows unique natural oak knots. Simply beautiful.',
      },
      {
        product: seededProducts[1]?._id,
        user: customerUser._id,
        username: customerUser.name,
        rating: 5,
        comment: 'Perfect for morning oolong tea. The rattan handle adds a wonderful warmth to the volcanic texture.',
      },
      {
        product: seededProducts[2]?._id,
        user: customerUser._id,
        username: customerUser.name,
        rating: 5,
        comment: 'Spreads a very soft diffuse glow. Makes our bedroom feel extremely cinematic and serene at night.',
      },
      {
        product: seededProducts[2]?._id,
        user: adminUser._id,
        username: adminUser.name,
        rating: 5,
        comment: 'Remarkable washi organic paper craft. Exceeded my high expectations.',
      },
      {
        product: seededProducts[3]?._id,
        user: customerUser._id,
        username: customerUser.name,
        rating: 4,
        comment: 'Organic asymmetry done perfectly. Looks excellent with dried branches.',
      },
    ];

    await Review.insertMany(reviewsData);

    return NextResponse.json({
      success: true,
      message: 'Luxury Japandi database seeded successfully!',
      credentials: {
        admin: {
          email: 'admin@kanso.com',
          password: 'password123',
        },
        customer: {
          email: 'imtiaz@example.com',
          password: 'password123',
        },
      },
      summary: {
        users: 2,
        categories: seededCategories.length,
        products: seededProducts.length,
        reviews: reviewsData.length,
      },
    });
  } catch (error: any) {
    console.error('Database seeding error:', error);
    return NextResponse.json({ error: error.message || 'Seeding failed' }, { status: 500 });
  }
}
