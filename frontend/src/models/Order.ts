import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId?: mongoose.Types.ObjectId;
  sku?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  productId?: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  landmark: string;
  totalPrice: number;
  deliveryCharge: number;
  paymentId?: string;
  upiLast4?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  orderType: 'Online' | 'WhatsApp' | 'UPI' | 'COD';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sku: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'
  },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String },
  totalPrice: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  paymentId: { type: String },
  upiLast4: { type: String },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'] 
  },
  orderType: { 
    type: String, 
    required: true, 
    enum: ['Online', 'WhatsApp', 'UPI', 'COD'] 
  }
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
