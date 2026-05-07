const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Product', productSchema);
