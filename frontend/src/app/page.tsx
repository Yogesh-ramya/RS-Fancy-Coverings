"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { Search, ChevronDown, Check, SlidersHorizontal } from "lucide-react";

const SortDropdown = ({ sortBy, setSortBy, t }: { sortBy: string; setSortBy: (v: string) => void; t: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    { value: "newest", label: t("newest") },
    { value: "price-low-high", label: t("priceLowHigh") },
    { value: "price-high-low", label: t("priceHighLow") },
  ];

  const currentLabel = options.find(o => o.value === sortBy)?.label;

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 whitespace-nowrap">
          {t("sortBy")}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-4 bg-white border border-gold-primary/20 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold text-foreground/70 hover:border-gold-primary transition-all min-w-[200px] justify-between group shadow-sm"
        >
          <span>{currentLabel}</span>
          <ChevronDown 
            size={14} 
            className={`transition-transform duration-300 text-gold-primary ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-away backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-full min-w-[220px] bg-white border border-gold-primary/10 shadow-xl z-50 py-2"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gold-primary/20" />
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-6 py-3.5 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-between group
                    ${sortBy === option.value 
                      ? 'bg-gold-soft/5 text-gold-primary' 
                      : 'text-foreground/60 hover:bg-gold-soft/5 hover:text-gold-primary'}
                  `}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={12} className="text-gold-primary" />
                    </motion.div>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

import { API_BASE_URL } from "@/config/apiConfig";
import SkeletonCard from "@/components/SkeletonCard";

function HomeContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setTimeout(() => setLoading(false), 500); // Small delay for smooth transition
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...allProducts];
    
    // Filter by Category
    if (category) {
      result = result.filter(p => p.category === category);
    }
    
    // Apply Sorting
    if (sortBy === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default to Newest (assuming _id or a date field exists)
      result.sort((a, b) => b._id.localeCompare(a._id));
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filtering or sorting
  }, [category, allProducts, sortBy]);

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="mt-20 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all
              ${currentPage === 1 
                ? 'border-gold-primary/10 text-foreground/20 cursor-not-allowed' 
                : 'border-gold-primary/20 text-gold-primary hover:bg-gold-soft/5 hover:border-gold-primary'}
            `}
          >
            {t("prev")}
          </button>
          
          <div className="px-8 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40">
              {t("page")}
            </span>
            <span className="text-sm font-premium font-bold text-gold-primary">
              {currentPage} <span className="text-foreground/20 font-normal mx-2">/</span> {totalPages}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all
              ${currentPage === totalPages 
                ? 'border-gold-primary/10 text-foreground/20 cursor-not-allowed' 
                : 'border-gold-primary/20 text-gold-primary hover:bg-gold-soft/5 hover:border-gold-primary'}
            `}
          >
            {t("next")}
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="w-48 h-px bg-gold-primary/10 relative overflow-hidden">
          <motion.div 
            initial={false}
            animate={{ left: `${((currentPage - 1) / (totalPages - 1 || 1)) * 100}%` }}
            className="absolute top-0 w-1/3 h-full bg-gold-primary" 
          />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      <Hero />

      {/* Categories / Trending Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gold-primary/10 pb-6 gap-6">
          <div className="flex-grow">
            <p className="text-gold-primary text-[11px] uppercase tracking-[0.3em] font-medium mb-2">
              {category ? `${t("showing")} ${category}` : "Our Curated Selection"}
            </p>
            <h2 className="text-4xl md:text-5xl font-premium font-bold tracking-tight text-foreground">
              {category ? category : t("trending")}
            </h2>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 w-full md:w-auto">
             {/* Enhanced Sort UI */}
             <SortDropdown sortBy={sortBy} setSortBy={setSortBy} t={t} />

            <div className="flex flex-col items-end gap-2">
              <p className="text-sm text-foreground/50 max-w-sm font-sans tracking-wide text-right hidden md:block">
                Discover our latest designs crafted with high-quality Coverings jewels and premium stones.
              </p>
              {category && (
                <Link 
                  href="/#products" 
                  className="text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:text-gold-accent border-b border-gold-primary/20 pb-1 transition-all"
                >
                  {t("viewAll")}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
             <p className="font-premium text-xl text-foreground/30 mb-4 italic">No masterpieces available in this category yet.</p>
             <Link href="/#products" className="text-gold-primary uppercase tracking-widest text-[10px] font-bold border-b border-gold-primary">{t("viewAll")}</Link>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {currentItems.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            <Pagination />
          </>
        )}
      </section>

      {/* Footer / Contact */}
      <footer className="mt-32 border-t border-gold-primary/10 pt-20 pb-10 text-center">
        <h2 className="text-3xl font-premium mb-6">RS FANCY COVERINGS</h2>
        <p className="text-foreground/50 text-sm max-w-sm mx-auto mb-10 px-4 leading-relaxed tracking-wide">
          Quality Gold-Plated Jewelry for every occasion. Ships worldwide from Tamil Nadu.
        </p>
        <div className="flex items-center justify-center gap-8 opacity-40">
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Premium Quality</span>
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Safe Payments</span>
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Fast Shipping</span>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-premium text-2xl italic text-gold-primary animate-pulse">Loading Boutique...</div>}>
      <HomeContent />
    </Suspense>
  );
}
