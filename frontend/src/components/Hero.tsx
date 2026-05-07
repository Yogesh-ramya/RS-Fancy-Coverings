"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background with soft gradients and premium feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#F5F5DC]/30 brightness-110" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-soft opacity-40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gold-primary/5 opacity-30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-gold-primary font-medium mb-6"
        >
          Exclusive Collection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-4xl md:text-7xl font-premium font-bold tracking-tight mb-8 leading-tight"
        >
          {t("heroTitle")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-foreground/70 max-w-2xl mx-auto mb-10 font-sans tracking-wide"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#products" className="w-full sm:w-auto">
            <button className="w-full px-10 py-4 bg-gold-primary text-white uppercase tracking-widest text-xs font-bold hover:bg-gold-accent transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold-primary/20">
              {t("shopNow")}
            </button>
          </a>
          <a href="#products" className="w-full sm:w-auto">
            <button className="w-full px-10 py-4 border border-gold-primary text-gold-primary uppercase tracking-widest text-xs font-bold hover:bg-gold-soft transition-all active:scale-95">
              View Collection
            </button>
          </a>
        </motion.div>
      </div>
    </section>  );
}
