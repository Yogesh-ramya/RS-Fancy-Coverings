"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-32 pb-20 px-4">
      <Navbar />
      
      <div className="max-w-xl mx-auto w-full flex-grow flex flex-col items-center justify-center text-center space-y-12">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
          className="w-24 h-24 bg-gold-soft/20 rounded-full flex items-center justify-center text-gold-primary border border-gold-primary/20"
        >
          <CheckCircle size={48} strokeWidth={1.5} />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-premium font-bold tracking-tight gold-text-gradient"
          >
            {t("thankYou")}
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-foreground/60 font-sans max-w-md mx-auto leading-relaxed"
          >
            {t("orderSuccessMsg")}
          </motion.p>
        </div>

        {/* Action / Information Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-white border border-gold-primary/10 p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-[#128C7E]">
            <MessageCircle size={20} />
            <span className="text-xs uppercase tracking-widest font-bold font-sans">Update Pending via WhatsApp</span>
          </div>
          <p className="text-[10px] text-foreground/40 uppercase tracking-[0.2em]">Our team will reach out to you within 24 hours.</p>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/"
            className="inline-block py-4 px-12 bg-gold-primary text-white text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gold-accent transition-all shadow-xl shadow-gold-primary/20 active:scale-95"
          >
            {t("backToHome")}
          </Link>
        </motion.div>
      </div>

      <footer className="mt-20 text-center opacity-30">
        <p className="text-[9px] uppercase tracking-[0.5em] font-premium">RS Fancy Coverings - Exclusive Experience</p>
      </footer>
    </div>
  );
}
