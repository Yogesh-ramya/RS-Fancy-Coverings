"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Globe, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuth } from "@/context/UserAuthContext";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { itemCount } = useCart();
  const { user, setShowModal } = useUserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Shop All", href: "/#products" },
    { name: "Earrings", href: "/?category=Earrings#products" },
    { name: "Necklaces", href: "/?category=Necklaces#products" },
    { name: "Bangles", href: "/?category=Bangles#products" },
    { name: "Others", href: "/?category=Others#products" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gold-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Menu Mobile Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground p-2 hover:text-gold-primary transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl md:text-2xl font-premium tracking-widest gold-text-gradient font-bold">
                RS FANCY COVERINGS
              </Link>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm uppercase tracking-widest hover:text-gold-primary transition-colors font-sans"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                className="hidden md:flex items-center text-[10px] md:text-xs uppercase tracking-widest hover:text-gold-primary transition-colors"
              >
                <Globe size={16} className="mr-1 hidden sm:block" />
                {language === "en" ? "Tamil" : "English"}
              </button>
              {user ? (
                <Link href="/profile" className="text-foreground hover:text-gold-primary transition-colors">
                  <User size={22} />
                </Link>
              ) : (
                <button onClick={() => setShowModal(true)} className="text-foreground hover:text-gold-primary transition-colors">
                  <User size={22} />
                </button>
              )}
              <Link href="/cart" className="relative text-foreground hover:text-gold-primary transition-colors">
                <ShoppingBag size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-gold-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Directly on top produced outside the nav for best layout) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[999] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#FDFCF8] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-r border-gold-primary/20 flex flex-col"
              style={{ backgroundColor: '#FDFCF8' }}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gold-primary/10 flex justify-between items-center bg-[#FDFCF8]">
                <span className="text-lg font-premium tracking-widest gold-text-gradient font-bold leading-tight">RS FANCY<br/>COVERINGS</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-foreground/40 p-2 hover:text-red-500 transition-colors bg-gold-soft/20 rounded-full"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 space-y-8 flex-grow overflow-y-auto bg-[#FDFCF8]">
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gold-primary font-bold mb-4 opacity-50 border-b border-gold-primary/5 pb-2 font-sans italic">Curated Collection</p>
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg uppercase tracking-[0.2em] font-medium hover:text-gold-primary transition-all py-1 hover:translate-x-3 duration-300 border-l-2 border-transparent hover:border-gold-primary pl-0 hover:pl-4"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user ? (
                    <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-lg uppercase tracking-[0.2em] font-medium hover:text-gold-primary transition-all py-1 hover:translate-x-3 duration-300 border-l-2 border-transparent hover:border-gold-primary pl-0 hover:pl-4 flex items-center gap-3"
                      >
                        <User size={18} className="text-gold-primary/40" /> My Profile
                    </Link>
                  ) : (
                    <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowModal(true);
                        }}
                        className="block w-full text-left text-lg uppercase tracking-[0.2em] font-medium hover:text-gold-primary transition-all py-1 hover:translate-x-3 duration-300 border-l-2 border-transparent hover:border-gold-primary pl-0 hover:pl-4 flex items-center gap-3"
                      >
                        <User size={18} className="text-gold-primary/40" /> Login
                    </button>
                  )}
                </div>
                
                {/* Mobile Language Toggle */}
                <div className="pt-8 mt-4 border-t border-gold-primary/10">
                  <button
                    onClick={() => {
                      setLanguage(language === "en" ? "ta" : "en");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center text-sm uppercase tracking-[0.3em] font-bold text-gold-primary hover:text-gold-accent transition-all w-full group p-4 bg-gold-soft/5 border border-gold-primary/5 hover:border-gold-primary/20"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-primary text-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Globe size={16} />
                    </div>
                    {language === "en" ? "Tamil Version" : "English Version"}
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-8 text-center border-t border-gold-primary/10 bg-gold-soft/10 mt-auto">
                <p className="text-[9px] uppercase tracking-[0.5em] text-foreground/40 mb-3 font-bold font-sans">Handcrafted Luxury</p>
                <div className="h-px w-12 bg-gold-primary/30 mx-auto mb-3" />
                <p className="text-[10px] text-gold-primary font-bold tracking-[0.2em] uppercase">RS Fancy Coverings</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
