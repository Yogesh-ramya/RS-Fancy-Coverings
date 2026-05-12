const { SiteStats, Visitor } = require('../models/analytics');
const Product = require('../models/product');
const Order = require('../models/order');

// Track Website Visit
exports.trackVisit = async (req, res) => {
  try {
    const { visitorId } = req.body;

    // 1. Update Total Views
    let stats = await SiteStats.findOne();
    if (!stats) {
      stats = new SiteStats({ totalViews: 1, totalVisitors: 1 });
      await stats.save();
    } else {
      stats.totalViews += 1;
      await stats.save();
    }

    // 2. Track Unique Visitor
    if (visitorId) {
      const existingVisitor = await Visitor.findOne({ visitorId });
      if (!existingVisitor) {
        const newVisitor = new Visitor({ visitorId });
        await newVisitor.save();
        
        // Increment total visitors count in stats
        stats.totalVisitors += 1;
        await stats.save();
      } else {
        existingVisitor.lastVisit = Date.now();
        await existingVisitor.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Track Product View
exports.trackProductView = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ success: true, views: product.views });
  } catch (error) {
    console.error('Error tracking product view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Analytics Stats
exports.getStats = async (req, res) => {
  try {
    const stats = await SiteStats.findOne() || { totalViews: 0, totalVisitors: 0 };
    
    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get top 5 most viewed products
    const topProducts = await Product.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name_en views price category');

    // Get total orders and revenue
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Calculate most sold products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId) {
          const id = item.productId.toString();
          productSales[id] = (productSales[id] || 0) + (item.quantity || 1);
        }
      });
    });

    const sortedSales = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const mostSoldProducts = await Promise.all(
      sortedSales.map(async ([id, count]) => {
        const product = await Product.findById(id).select('name_en category price');
        return product ? { ...product._doc, salesCount: count } : null;
      })
    );

    // Category distribution
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName totalPrice status createdAt');

    res.status(200).json({
      totalViews: stats.totalViews,
      totalVisitors: stats.totalVisitors,
      totalProducts,
      totalOrders,
      totalRevenue,
      topProducts,
      mostSoldProducts: mostSoldProducts.filter(p => p !== null),
      categoryDistribution: categories,
      recentOrders
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

