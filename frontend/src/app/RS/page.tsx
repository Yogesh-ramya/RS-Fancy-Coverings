"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  ArrowUpRight,
  Package,
  ShoppingCart,
  Clock,
  PieChart,
  ChevronRight,
  BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { API_BASE_URL } from "@/config/apiConfig";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStock: number;
  newCustomers: number;
  totalViews: number;
  totalVisitors: number;
  topProducts: any[];
  mostSoldProducts: any[];
  categoryDistribution: any[];
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    newCustomers: 0,
    totalViews: 0,
    totalVisitors: 0,
    topProducts: [],
    mostSoldProducts: [],
    categoryDistribution: [],
    recentOrders: []
  });

  const [loading, setLoading] = useState(true);
  const [prevOrdersCount, setPrevOrdersCount] = useState<number | null>(null);
  const [newOrderNotify, setNewOrderNotify] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const analyticsRes = await fetch(`${API_BASE_URL}/api/analytics/stats`);
        const analytics = await analyticsRes.json();

        const productRes = await fetch(`${API_BASE_URL}/api/products`);
        const products = await productRes.json();
        const lowStock = products.filter((p: any) => p.stock <= 5).length;

        setStats({
          totalSales: analytics.totalRevenue || 0,
          totalOrders: analytics.totalOrders || 0,
          totalProducts: analytics.totalProducts || 0,
          lowStock,
          newCustomers: analytics.totalVisitors || 0, // Simplified
          totalViews: analytics.totalViews || 0,
          totalVisitors: analytics.totalVisitors || 0,
          topProducts: analytics.topProducts || [],
          mostSoldProducts: analytics.mostSoldProducts || [],
          categoryDistribution: analytics.categoryDistribution || [],
          recentOrders: analytics.recentOrders || []
        });

        // Dashboard Notification Logic
        if (prevOrdersCount !== null && (analytics.totalOrders || 0) > prevOrdersCount) {
          const latestOrder = analytics.recentOrders?.[0];
          if (latestOrder) {
            setNewOrderNotify(latestOrder);
            // Auto hide after 10 seconds
            setTimeout(() => setNewOrderNotify(null), 10000);
          }
        }
        setPrevOrdersCount(analytics.totalOrders || 0);

      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [prevOrdersCount]);

  const cards = [
    { label: "Total Revenue", value: `₹${stats.totalSales}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-gold-primary", bg: "bg-gold-soft/20" },
    { label: "Website Views", value: stats.totalViews, icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Global Notifications */}
      <AnimatePresence>
        {newOrderNotify && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed top-8 right-8 z-[100] w-80"
          >
            <div className="bg-white border-2 border-gold-primary shadow-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-primary animate-pulse" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-soft/20 rounded-full text-gold-primary">
                  <BellRing className="animate-bounce" size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-gold-primary mb-1">New Order Received!</h3>
                  <p className="text-sm font-bold text-foreground mb-1">{newOrderNotify.customerName}</p>
                  <p className="text-[10px] text-foreground/50 font-medium mb-3">Total: ₹{newOrderNotify.totalPrice}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setNewOrderNotify(null)}
                      className="px-4 py-1.5 bg-gold-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold-accent transition-all"
                    >
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-premium font-bold tracking-tight">Executive Summary</h1>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <p className="text-[10px] sm:text-xs font-sans text-foreground/40 uppercase tracking-widest">
            Live Dashboard • Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 border border-gold-primary/10 shadow-sm animate-pulse">
              <div className="w-10 h-10 bg-gold-soft/10 mb-4" />
              <div className="h-2 bg-gold-soft/10 w-20 mb-2" />
              <div className="h-8 bg-gold-soft/10 w-24" />
            </div>
          ))
        ) : cards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="bg-white p-6 border border-gold-primary/10 shadow-sm flex flex-col justify-between hover:border-gold-primary/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className={`${card.bg} p-3 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                <card.icon size={20} />
              </div>
              <ArrowUpRight size={14} className="text-foreground/20 group-hover:text-gold-primary transition-colors" />
            </div>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl sm:text-3xl font-premium font-bold tracking-tight text-foreground/80">
                {card.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* High-Level Insights / Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.topProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gold-soft/5 border border-gold-primary/20 p-6 flex items-center gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 bg-gold-primary text-white text-[8px] uppercase tracking-tighter font-bold">
              Most Viewed
            </div>
            <div className="w-24 h-24 bg-white border border-gold-primary/10 overflow-hidden flex-shrink-0">
              {stats.topProducts[0]?.images?.[0] ? (
                <img 
                  src={stats.topProducts[0].images[0]} 
                  alt={stats.topProducts[0].name_en} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gold-primary/20">
                  <Package size={32} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xs uppercase tracking-widest text-gold-primary font-bold mb-1">Top Performer</h3>
              <h2 className="text-xl font-premium font-bold text-foreground/80 mb-2 truncate max-w-[200px]">
                {stats.topProducts[0].name_en}
              </h2>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-foreground/40 uppercase">Total Interest</p>
                  <p className="text-lg font-bold text-gold-primary">{stats.topProducts[0].views} Views</p>
                </div>
                <div className="h-8 w-[1px] bg-gold-primary/10"></div>
                <div>
                  <p className="text-[10px] text-foreground/40 uppercase">Price</p>
                  <p className="text-lg font-bold text-foreground/60">₹{stats.topProducts[0].price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stats.mostSoldProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-50/30 border border-green-100 p-6 flex items-center gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 bg-green-600 text-white text-[8px] uppercase tracking-tighter font-bold">
              Best Seller
            </div>
            <div className="w-24 h-24 bg-white border border-green-100 overflow-hidden flex-shrink-0">
              {stats.mostSoldProducts[0]?.images?.[0] ? (
                <img 
                  src={stats.mostSoldProducts[0].images[0]} 
                  alt={stats.mostSoldProducts[0].name_en} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-green-200">
                  <ShoppingBag size={32} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xs uppercase tracking-widest text-green-600 font-bold mb-1">Customer Choice</h3>
              <h2 className="text-xl font-premium font-bold text-foreground/80 mb-2 truncate max-w-[200px]">
                {stats.mostSoldProducts[0].name_en}
              </h2>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-foreground/40 uppercase">Total Sales</p>
                  <p className="text-lg font-bold text-green-600">{stats.mostSoldProducts[0].salesCount} Units</p>
                </div>
                <div className="h-8 w-[1px] bg-green-100"></div>
                <div>
                  <p className="text-[10px] text-foreground/40 uppercase">Revenue</p>
                  <p className="text-lg font-bold text-foreground/60">₹{stats.mostSoldProducts[0].price * stats.mostSoldProducts[0].salesCount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Popular Products */}
        <div className="lg:col-span-2 bg-white border border-gold-primary/10 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-premium font-bold tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-gold-primary" />
              Detailed Engagement Metrics
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gold-soft/10 text-gold-primary text-[10px] font-bold uppercase tracking-widest border border-gold-primary/10">Most Viewed</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-foreground/40 border-b border-gold-primary/10">
                  <th className="pb-4">Product Info</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4 text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.topProducts.map((product: any, idx: number) => (
                  <tr key={idx} className="border-b border-gold-primary/5 hover:bg-gold-soft/5 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold-soft/5 border border-gold-primary/10 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gold-primary/20">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground/80 group-hover:text-gold-primary transition-colors">{product.name_en}</p>
                          <p className="text-[10px] text-foreground/40 uppercase tracking-tighter">ID: {product._id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-foreground/50">{product.category}</td>
                    <td className="py-4 text-foreground/50">₹{product.price}</td>
                    <td className="py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-gold-primary">{product.views} Views</span>
                        <div className="w-16 h-1 bg-gold-soft/20 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-gold-primary" 
                            style={{ width: `${(product.views / (stats.topProducts[0]?.views || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {stats.topProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-foreground/20 italic">No view data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* System Alerts & Notifications */}
        <div className="space-y-6">
          <div className="bg-white border border-gold-primary/10 p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gold-primary mb-6 underline underline-offset-8 flex items-center gap-2">
              <AlertTriangle size={14} />
              Priority Alerts
            </h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-red-500 bg-red-50/30 text-xs">
                <p className="font-bold text-red-600 mb-1 tracking-widest uppercase">Inventory Low</p>
                <p className="text-foreground/60 leading-relaxed font-sans">
                  {stats.lowStock} products are below the critical stock threshold (5 units).
                </p>
                <button className="mt-2 text-[10px] font-bold text-red-600 flex items-center gap-1 hover:underline">
                  Restock Now <ChevronRight size={10} />
                </button>
              </div>
              <div className="p-4 border-l-4 border-gold-primary bg-gold-soft/10 text-xs">
                <p className="font-bold text-gold-primary mb-1 tracking-widest uppercase">Pending Verification</p>
                <p className="text-foreground/60 leading-relaxed font-sans">
                  {stats.totalOrders} total orders need payment verification.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gold-primary/10 p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gold-primary mb-6 flex items-center gap-2">
              <PieChart size={14} />
              Stock by Category
            </h2>
            <div className="space-y-3">
              {stats.categoryDistribution.map((cat: any) => (
                <div key={cat._id} className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60 font-sans">{cat._id}</span>
                  <div className="flex-1 mx-3 h-1 bg-gold-soft/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold-primary" 
                      style={{ width: `${(cat.count / stats.totalProducts) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground/80">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Sold Products */}
        <div className="bg-white border border-gold-primary/10 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-premium font-bold mb-8 tracking-tight flex items-center gap-2">
            <ShoppingCart size={20} className="text-gold-primary" />
            Top Selling Items
          </h2>
          <div className="space-y-4">
            {stats.mostSoldProducts.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 p-4 border border-gold-primary/5 hover:border-gold-primary/20 transition-all group">
                <div className="w-10 h-10 bg-gold-soft/10 flex items-center justify-center text-gold-primary font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground/80 group-hover:text-gold-primary transition-colors">{product.name_en}</h4>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground/80">{product.salesCount} Sold</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">₹{product.price * product.salesCount}</p>
                </div>
              </div>
            ))}
            {stats.mostSoldProducts.length === 0 && (
              <div className="py-10 text-center text-foreground/20 italic font-sans">No sales data available.</div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gold-primary/10 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-premium font-bold mb-8 tracking-tight flex items-center gap-2">
            <Clock size={20} className="text-gold-primary" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            {stats.recentOrders.map((order: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between gap-4 border-l-2 border-gold-soft/30 pl-4 py-1">
                <div>
                  <h4 className="text-sm font-medium text-foreground/80">{order.customerName}</h4>
                  <p className="text-[10px] text-foreground/40 font-sans">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground/80">₹{order.totalPrice}</p>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${
                    order.status === 'Completed' ? 'text-green-600' : 
                    order.status === 'Pending' ? 'text-gold-primary' : 'text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="py-10 text-center text-foreground/20 italic font-sans">No recent activity.</div>
            )}
          </div>
          <button className="w-full mt-8 py-3 border border-gold-primary/10 text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:bg-gold-soft/5 transition-colors">
            View Full Order History
          </button>
        </div>
      </div>
    </div>
  );
}


