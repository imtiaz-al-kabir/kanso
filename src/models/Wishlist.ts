import mongoose, { Schema, model, models } from 'mongoose';

const WishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = models.Wishlist || model('Wishlist', WishlistSchema);
export default Wishlist;
