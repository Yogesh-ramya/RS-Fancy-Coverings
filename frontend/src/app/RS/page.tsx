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
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/apiConfig";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
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
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Popular Products */}
        <div className="lg:col-span-2 bg-white border border-gold-primary/10 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-premium font-bold tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-gold-primary" />
              Most Popular Products
            </h2>
            <button className="text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-foreground/40 border-b border-gold-primary/10">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4 text-right">Views</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.topProducts.map((product: any, idx: number) => (
                  <tr key={idx} className="border-b border-gold-primary/5 hover:bg-gold-soft/5 transition-colors group">
                    <td className="py-4 font-medium text-foreground/80 group-hover:text-gold-primary transition-colors">
                      {product.name_en}
                    </td>
                    <td className="py-4 text-foreground/50">{product.category}</td>
                    <td className="py-4 text-foreground/50">₹{product.price}</td>
                    <td className="py-4 text-right font-bold text-gold-primary">{product.views}</td>
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


