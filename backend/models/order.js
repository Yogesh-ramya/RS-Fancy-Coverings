const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sku: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  // For single buy now backward compatibility
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'
  },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  paymentId: { type: String }, // For Razorpay
  upiLast4: { type: String },  // For Manual UPI
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'] 
  },
  orderType: { 
    type: String, 
    required: true, 
    enum: ['Online', 'WhatsApp', 'UPI'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
