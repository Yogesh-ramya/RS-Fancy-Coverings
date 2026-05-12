"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareProductProps {
  product: {
    _id: string;
    name_en: string;
    name_ta: string;
  };
  variant?: "icon" | "full";
}

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function ShareProduct({ product, variant = "full" }: ShareProductProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productName = language === "en" ? product.name_en : product.name_ta;
  const shareUrl = `${window.location.origin}/?product=${product._id}`;
  const shareText = `Check out this beautiful ${productName} from RS Fancy Coverings!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={18} />,
      color: "#25D366",
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank");
      }
    },
    {
      name: "Facebook",
      icon: <FacebookIcon size={18} />,
      color: "#1877F2",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
      }
    },
    {
      name: t("copyLink"),
      icon: copied ? <Check size={18} /> : <Copy size={18} />,
      color: "#71717a",
      action: handleCopyLink
    }
  ];

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-full border border-gold-primary/30 text-gold-primary hover:bg-gold-primary hover:text-white transition-all shadow-lg active:scale-90"
          title={t("share")}
        >
          <Share2 size={18} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="fixed inset-0 z-[60] bg-black/5"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full right-0 mt-3 bg-white border border-gold-primary/20 shadow-2xl rounded-xl p-2 z-[70] flex flex-col gap-1 min-w-[150px]"
              >
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      option.action();
                      if (option.name !== t("copyLink")) setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold text-foreground/70 hover:bg-gold-soft/10 hover:text-gold-primary rounded-lg transition-all text-left w-full whitespace-nowrap"
                  >
                    <span style={{ color: option.color }}>{option.icon}</span>
                    {option.name}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">{t("share")}</h4>
      <div className="flex flex-wrap gap-3">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={option.action}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gold-primary/10 rounded-none text-[10px] uppercase tracking-widest font-bold text-foreground/70 hover:border-gold-primary/40 hover:bg-gold-soft/5 transition-all shadow-sm group"
          >
            <span style={{ color: option.color }} className="group-hover:scale-110 transition-transform">
              {option.icon}
            </span>
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
