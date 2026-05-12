const { SiteStats, Visitor } = require('../models/analytics');
const Product = require('../models/product');

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
    
    // Get top 5 most viewed products
    const topProducts = await Product.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name_en views price category');

    res.status(200).json({
      totalViews: stats.totalViews,
      totalVisitors: stats.totalVisitors,
      topProducts
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
