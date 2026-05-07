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
    newCustomers: 0
  });

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

        setStats({
          totalSales,
          totalOrders: orders.length,
          lowStock,
          newCustomers: Array.from(new Set(orders.map((o: any) => o.phone))).length
        });
      } catch (err) {
        console.error("Stats error:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Revenue", value: `₹${stats.totalSales}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Low Stock Items", value: stats.lowStock, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Unique Customers", value: stats.newCustomers, icon: Users, color: "text-gold-primary", bg: "bg-gold-soft/20" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-premium font-bold tracking-tight">Executive Summary</h1>
        <p className="text-xs sm:text-sm font-sans text-foreground/40 uppercase tracking-widest">
          Daily performance of RS Fancy Coverings
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
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
              <h3 className="text-3xl font-premium font-bold tracking-tight text-foreground/80">
                {card.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        <div className="lg:col-span-2 bg-white border border-gold-primary/10 p-6 sm:p-10 shadow-sm min-h-[400px]">
          <h2 className="text-xl font-premium font-bold mb-8 tracking-tight">Sales Analytics</h2>
          <div className="h-full flex flex-col items-center justify-center text-foreground/20 italic">
            Visual analytics will appear after more historical data is gathered.
            <div className="h-40 w-full bg-gold-soft/5 mt-8 border-t border-gold-primary/10 border-dashed" />
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
