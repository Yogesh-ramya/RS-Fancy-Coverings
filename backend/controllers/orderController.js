const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

// Create a new order (handles stock reduction, Cart/Single, and UPI)
exports.createOrder = async (req, res) => {
  const { productId, items, customerName, phone, address, orderType, paymentId, upiLast4, totalPrice, deliveryCharge } = req.body;

  try {
    // Handle stock reduction for all items (only if valid IDs are provided)
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }
      }
    } else if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -1 } });
    }

    // Sanitize item IDs before saving to prevent Mongoose validation errors
    const sanitizedItems = (items || []).map(item => ({
      ...item,
      productId: (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) ? item.productId : null
    }));

    const sanitizedProductId = (productId && mongoose.Types.ObjectId.isValid(productId)) ? productId : null;

    // Create order
    const order = new Order({
      productId: sanitizedProductId,
      items: sanitizedItems,
      customerName,
      phone,
      address,
      totalPrice,
      deliveryCharge: deliveryCharge || 0,
      orderType,
      paymentId: paymentId || null,
      upiLast4: upiLast4 || null,
      status: 'Pending'
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order save error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete order (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
