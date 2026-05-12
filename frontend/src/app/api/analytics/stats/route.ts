import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteStats } from '@/models/Analytics';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get basic stats
    const stats = await SiteStats.findOne() || { totalViews: 0, totalVisitors: 0 };
    
    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get top 5 most viewed products
    const topProducts = await Product.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name_en views price category images');

    // Get total orders and revenue
    // Using simple find instead of complex aggregation for reliability
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Calculate most sold products
    const productSales: Record<string, number> = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.productId) {
            const id = item.productId.toString();
            productSales[id] = (productSales[id] || 0) + (item.quantity || 1);
          }
        });
      }
    });

    const sortedSales = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const mostSoldProducts = await Promise.all(
      sortedSales.map(async ([id, count]) => {
        try {
          const product = await Product.findById(id).select('name_en category price images');
          return product ? { ...product.toObject(), salesCount: count } : null;
        } catch (err) {
          return null;
        }
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

    return NextResponse.json({
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
  } catch (error: any) {
    console.error('Error getting analytics stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
