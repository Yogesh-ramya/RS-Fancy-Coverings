import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  color?: string;
  size?: string;
  plating?: string;
}

export interface IProduct extends Document {
  name_en: string;
  name_ta: string;
  productId?: string;
  description_en?: string;
  description_ta?: string;
  category: 'Earrings' | 'Necklaces' | 'Bangles' | 'Others';
  price: number;
  stock: number;
  images: string[];
  variants: IVariant[];
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name_en: { type: String, required: true },
  name_ta: { type: String, required: true },
  productId: { type: String, unique: true, sparse: true },
  description_en: { type: String },
  description_ta: { type: String },
  category: { 
    type: String, 
    required: true, 
    enum: ['Earrings', 'Necklaces', 'Bangles', 'Others'] 
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  variants: [{
    color: { type: String },
    size: { type: String },
    plating: { type: String }
  }],
  isTrending: { type: Boolean, default: false }
}, { timestamps: true });

// Check if the model exists before compiling to prevent OverwriteModelError in Next.js HMR
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
