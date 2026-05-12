"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  ArrowUpRight 
} from "lucide-react";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/apiConfig";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStock: 0,
    newCustomers: 0,
    totalViews: 0,
    totalVisitors: 0,
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch background stats (Simulation for now)
    const fetchStats = async () => {
      try {
        const orderRes = await fetch(`${API_BASE_URL}/api/orders`);
        const orders = await orderRes.json();
        const productRes = await fetch(`${API_BASE_URL}/api/products`);
        const products = await productRes.json();

        const totalSales = orders.reduce((acc: number, o: any) => acc + (o.totalPrice || 0), 0);
        const lowStock = products.filter((p: any) => p.stock <= 5).length;

        const analyticsRes = await fetch(`${API_BASE_URL}/api/analytics/stats`);
        const analytics = await analyticsRes.json();

        setStats({
          totalSales,
          totalOrders: orders.length,
          lowStock,
          newCustomers: Array.from(new Set(orders.map((o: any) => o.phone))).length,
          totalViews: analytics.totalViews,
          totalVisitors: analytics.totalVisitors,
          topProducts: analytics.topProducts || []
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
    { label: "Website Views", value: stats.totalViews, icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Unique Visitors", value: stats.totalVisitors, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-gold-primary", bg: "bg-gold-soft/20" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-premium font-bold tracking-tight">Executive Summary</h1>
        <p className="text-xs sm:text-sm font-sans text-foreground/40 uppercase tracking-widest">
          Daily performance of RS Fancy Coverings
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 border border-gold-primary/10 shadow-sm animate-pulse">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-gold-soft/10" />
                <div className="w-4 h-4 bg-gold-soft/10" />
              </div>
              <div className="mt-8">
                <div className="h-2 bg-gold-soft/10 w-20 mb-2" />
                <div className="h-8 bg-gold-soft/10 w-24" />
              </div>
            </div>
          ))
        ) : cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 sm:p-8 border border-gold-primary/10 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={card.bg + " p-3 " + card.color}>
                <card.icon size={20} />
              </div>
              <ArrowUpRight size={14} className="text-foreground/20" />
            </div>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">
                {card.label}
              </p>
              <h3 className="text-xl sm:text-3xl font-premium font-bold tracking-tight text-foreground/80">
                {card.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        <div className="lg:col-span-2 bg-white border border-gold-primary/10 p-6 sm:p-10 shadow-sm min-h-[400px]">
          <h2 className="text-xl font-premium font-bold mb-8 tracking-tight">Most Popular Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-foreground/40 border-b border-gold-primary/10">
                  <th className="pb-4">Product Name</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4 text-right">Total Views</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.topProducts.map((product: any, idx: number) => (
                  <tr key={idx} className="border-b border-gold-primary/5 hover:bg-gold-soft/5 transition-colors">
                    <td className="py-4 font-medium text-foreground/80">{product.name_en}</td>
                    <td className="py-4 text-foreground/50">{product.category}</td>
                    <td className="py-4 text-foreground/50">₹{product.price}</td>
                    <td className="py-4 text-right font-bold text-gold-primary">{product.views}</td>
                  </tr>
                ))}
                {stats.topProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-foreground/20 italic">No view data available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-gold-primary/10 p-6 sm:p-10 shadow-sm h-fit">
          <h2 className="text-xs uppercase tracking-widest font-bold text-gold-primary mb-8 underline underline-offset-8">
            System Alerts
          </h2>
          <div className="space-y-6">
            <div className="p-4 border border-red-100 bg-red-50/20 text-xs">
              <p className="font-bold text-red-600 mb-1 tracking-widest uppercase">Stock Alert</p>
              <p className="text-foreground/60 leading-relaxed font-sans">
                You have {stats.lowStock} products with less than 5 units remaining in the warehouse.
              </p>
            </div>
            <div className="p-4 border border-gold-primary/10 bg-gold-soft/10 text-xs">
              <p className="font-bold text-gold-primary mb-1 tracking-widest uppercase">Payment Verification</p>
              <p className="text-foreground/60 leading-relaxed font-sans">
                {stats.totalOrders} total orders placed through manual UPI. Go to Orders to verify payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
