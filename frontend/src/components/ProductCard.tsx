import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, MessageCircle, AlertCircle, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import ProductModal from "./ProductModal";
import ShareProduct from "./ShareProduct";

import Image from "next/image";

interface ProductCardProps {
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const name = language === "en" ? product.name_en : product.name_ta;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleWhatsAppOrder = () => {
    const productIdStr = product.productId ? ` (ID: ${product.productId})` : "";
    const message = `Hi, I want to order:\n\nProduct: ${product.name_en}${productIdStr}\nPrice: ₹${product.price}`;
    window.open(`https://wa.me/918778807980?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        className="group bg-white rounded-none border border-gold-primary/10 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300"
      >
        {/* Product Image - Clickable */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[4/5] overflow-hidden bg-gold-soft/20 cursor-pointer"
        >
          <Image
            src={product.images?.[0] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={false}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full border border-gold-primary/20 text-gold-primary scale-90 group-hover:scale-100 transition-transform duration-300">
              <Maximize2 size={20} />
            </div>
          </div>

          {/* Badge: Low Stock */}
          {isLowStock && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] uppercase font-bold px-3 py-1 flex items-center shadow-lg">
              <AlertCircle size={12} className="mr-1" />
              {t("onlyFewLeft").replace("{stock}", product.stock.toString())}
            </div>
          )}

          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-gold-primary bg-white/90 px-3 py-1.5 backdrop-blur-sm border border-gold-primary/20">
            {product.category}
          </div>
        </div>

        {/* Share Button - Moved outside the clickable image div */}
        <div className="absolute top-4 right-4 z-[30]">
          <ShareProduct product={product} variant="icon" />
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-6 flex-grow flex flex-col justify-between">
          <div className="mb-2 sm:mb-4">
            <h3 className="text-sm sm:text-xl font-premium font-medium tracking-tight mb-1 sm:mb-2 group-hover:text-gold-primary transition-colors truncate sm:whitespace-normal">
              {name}
            </h3>
            <p className="text-base sm:text-xl font-sans font-semibold text-gold-primary">
              ₹{product.price}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
            <button 
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-white border border-gold-primary text-gold-primary text-[9px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold hover:bg-gold-soft transition-all shadow-sm active:scale-[0.98]"
            >
              <ShoppingCart size={12} className="sm:w-[14px] sm:h-[14px]" />
              {t("addToCart")}
            </button>
            <button 
              onClick={() => window.location.href = `/payment?id=${product._id}&name=${encodeURIComponent(name)}&subtotal=${product.price}&sku=${encodeURIComponent(product.productId || "")}`}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-gold-primary text-white text-[9px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold hover:bg-gold-accent transition-all shadow-md active:scale-[0.98]"
            >
              {t("buyNow")}
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full hidden sm:flex items-center justify-center gap-2 py-3 border border-[#25D366] text-[#128C7E] text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-[#25D366]/10 transition-all active:scale-[0.98]"
            >
              <MessageCircle size={16} />
              {t("whatsappOrder")}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Product Details Modal */}
      <ProductModal 
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
