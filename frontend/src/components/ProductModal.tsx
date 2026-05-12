"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, MessageCircle, X, Check, XCircle } from "lucide-react";
import ShareProduct from "./ShareProduct";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { API_BASE_URL } from "@/config/apiConfig";

const API_URL = `${API_BASE_URL}/api/analytics`;

import Image from "next/image";

interface ProductModalProps {
  product: {
    _id: string;
    name_en: string;
    name_ta: string;
    description_en?: string;
    description_ta?: string;
    price: number;
    stock: number;
    category: string;
    images?: string[];
    productId?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isOpen && product?._id) {
      const trackProductView = async () => {
        try {
          await fetch(`${API_URL}/product/${product._id}/view`, {
            method: 'POST',
          });
        } catch (error) {
          console.error('Failed to track product view:', error);
        }
      };
      trackProductView();
    }
  }, [isOpen, product?._id]);

  const name = language === "en" ? product.name_en : product.name_ta;
  const description = language === "en" ? product.description_en : product.description_ta;
  const isOutOfStock = product.stock <= 0;
  
  const handleWhatsAppOrder = () => {
    const productIdStr = product.productId ? ` (ID: ${product.productId})` : "";
    const message = `Hi, I want to order:\n\nProduct: ${product.name_en}${productIdStr}\nPrice: ₹${product.price}`;
    window.open(`https://wa.me/918778807980?text=${encodeURIComponent(message)}`, "_blank");
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden sm:max-h-[95vh] rounded-t-3xl sm:rounded-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-foreground/40 hover:text-gold-primary p-2 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Left Side: Images */}
            <div className="w-full md:w-1/2 bg-gold-soft/10 flex flex-col shrink-0">
              <div className="flex-grow flex items-center justify-center p-6 sm:p-12 min-h-[40vh] sm:min-h-[300px] relative">
                <div className="relative w-full h-[350px] sm:h-[400px]">
                  <Image
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex justify-center gap-3 bg-white/50 backdrop-blur-md border-t border-gold-primary/10 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 border-2 transition-all shrink-0 ${
                        selectedImage === idx ? "border-gold-primary" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image 
                        src={img} 
                        alt={`${name} ${idx}`} 
                        fill 
                        className="object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Info */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-[10px] uppercase tracking-widest text-gold-primary py-1 px-3 border border-gold-primary/20 bg-gold-soft/20">
                    {product.category}
                  </span>
                  <div className={`flex items-center text-[10px] uppercase tracking-widest font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                    {isOutOfStock ? <XCircle size={12} className="mr-1"/> : <Check size={12} className="mr-1"/>}
                    {isOutOfStock ? t("outOfStock") : t("inStock")}
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-premium font-bold mb-3 sm:mb-4 tracking-tight leading-tight">
                  {name}
                </h2>
                
                <p className="text-2xl sm:text-3xl font-sans font-bold text-gold-primary mb-4 sm:mb-6">
                  ₹{product.price}
                </p>

                {description && (
                  <div className="space-y-3 mb-8">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">{t("description")}</h4>
                    <p className="text-foreground/70 leading-relaxed font-sans text-sm md:text-base">
                      {description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 border border-gold-primary text-gold-primary text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold-soft transition-all shadow-sm active:scale-95 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ShoppingCart size={16} />
                    {t("addToCart")}
                  </button>
                  <button
                    onClick={() => window.location.href = `/payment?id=${product._id}&name=${encodeURIComponent(name)}&subtotal=${product.price}&sku=${encodeURIComponent(product.productId || "")}`}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 bg-gold-primary text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold-accent transition-all shadow-md active:scale-95 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {t("buyNow")}
                  </button>
                </div>
                
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-[#25D366] text-[#128C7E] text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-[#25D366]/10 transition-all active:scale-[0.98]"
                >
                  <MessageCircle size={18} />
                  {t("whatsappOrder")}
                </button>
              </div>

              <div className="mt-8">
                <ShareProduct product={product} variant="full" />
              </div>

              <div className="mt-8 pt-8 border-t border-gold-primary/5">
                 <p className="text-[9px] text-foreground/30 uppercase tracking-[0.3em] font-medium text-center">RS Fancy Coverings - Exclusive Jewelry Collection</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
