"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, deliveryCharge, totalWithDelivery, itemCount } = useCart();
  const { language, t } = useLanguage();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 px-4">
          <ShoppingBag size={80} className="text-gold-primary/20 mb-6" />
          <h2 className="text-3xl font-premium mb-4">Your Bag is Empty</h2>
          <p className="text-foreground/50 mb-8">Discover our exquisite collection to find your perfect match.</p>
          <Link href="/" className="px-8 py-3 bg-gold-primary text-white uppercase tracking-widest text-xs font-bold shadow-lg shadow-gold-primary/20">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    const itemsSummary = cartItems.map(item => `${item.name_en} (x${item.quantity})`).join(", ");
    window.location.href = `/payment?name=${encodeURIComponent(itemsSummary)}&subtotal=${totalAmount}&delivery=${deliveryCharge}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between mb-12 border-b border-gold-primary/10 pb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-premium font-bold tracking-tight">Shopping Bag ({itemCount})</h1>
          <Link href="/" className="text-[10px] sm:text-xs uppercase tracking-widest text-gold-primary hover:text-gold-accent font-bold">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white border border-gold-primary/10 relative group"
                >
                  <div className="w-full sm:w-24 h-64 sm:h-32 bg-gold-soft/20 flex-shrink-0 overflow-hidden">
                    <img 
                      src={(item.images && item.images[0]) || item.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400"} 
                      alt={language === "en" ? item.name_en : item.name_ta} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>

                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                        <p className="text-[9px] uppercase tracking-widest text-gold-primary mb-1">{item.category}</p>
                        <h3 className="text-lg font-premium font-medium">
                          {language === "en" ? item.name_en : item.name_ta}
                        </h3>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-foreground/20 hover:text-red-500 transition-colors sm:hidden"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="text-gold-primary font-bold mb-4 font-sans tracking-wide">₹{item.price}</p>

                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center border border-gold-primary/20 bg-background rounded-none">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          className="p-2 hover:bg-gold-soft transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="p-2 hover:bg-gold-soft transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors hidden sm:block"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gold-primary/20 p-8 sticky top-32 shadow-sm">
              <h2 className="text-2xl font-premium font-bold mb-8 pb-4 border-b border-gold-primary/10 tracking-tight">
                {t("orderSummary")}
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/50 uppercase tracking-widest text-[11px] font-medium">{t("subtotal")}</span>
                  <span className="font-bold text-lg font-sans">₹{totalAmount}</span>
                </div>
                
                <div className="flex justify-between items-start gap-4">
                  <span className="text-foreground/50 uppercase tracking-widest text-[11px] font-medium pt-0.5">{t("deliveryCharge")}</span>
                  <span className={`${deliveryCharge === 0 ? "text-green-600" : "text-foreground"} font-bold uppercase text-[11px] tracking-widest text-right`}>
                    {deliveryCharge === 0 ? t("freeDelivery") : `₹${deliveryCharge}`}
                  </span>
                </div>

                {deliveryCharge > 0 && (
                  <div className="p-3 bg-gold-soft/10 border border-gold-primary/10 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-gold-primary font-bold">
                      {t("spendMoreForFreeDelivery").replace("{amount}", (500 - totalAmount).toString())}
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-gold-primary/10 flex justify-between items-baseline">
                  <span className="font-premium font-bold text-lg tracking-tight">{t("totalBill")}</span>
                  <span className="text-2xl font-bold text-gold-primary font-sans">₹{totalWithDelivery}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-5 bg-gold-primary text-white uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-gold-accent hover:gold-glow transition-all duration-300 flex items-center justify-center group relative overflow-hidden active:scale-95"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] h-full -skew-x-20 animate-shimmer" />
                </div>

                <span className="relative z-10 flex items-center">
                  Proceed to Checkout
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </button>

              <div className="mt-8 pt-4 flex items-center justify-center gap-2.5 text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-bold border-t border-gold-primary/5">
                <ShoppingBag size={11} className="text-gold-primary/40" />
                Secure Boutique Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
