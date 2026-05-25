import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
      index: true,
    },
    countInStock: {
      type: Number,
      required: [true, 'Please provide stock count'],
      default: 0,
      min: 0,
    },
    variants: {
      type: [String], // Array of attributes like ["Size: S", "Size: M", "Color: Sand"]
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model('Product', ProductSchema);
export default Product;
