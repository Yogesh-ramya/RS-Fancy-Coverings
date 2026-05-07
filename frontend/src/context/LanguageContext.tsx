"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    heroTitle: "Luxury Coverings Jewels",
    heroSubtitle: "Timeless designs for every occasion.",
    shopNow: "Shop Now",
    trending: "Trending Products",
    categories: "Categories",
    buyNow: "Buy Now",
    whatsappOrder: "Order on WhatsApp",
    onlyFewLeft: "Only {stock} left!",
    addToCart: "Add to Cart",
    shopAll: "Shop All",
    viewAll: "View All",
    showing: "Showing",
    thankYou: "Thank You for Your Order!",
    orderSuccessMsg: "We have received your order. An update will be sent via WhatsApp soon.",
    backToHome: "Back to Shopping",
    sortBy: "Sort By",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    newest: "Newest First",
    description: "Description",
    stockLabel: "Stock Status",
    categoryLabel: "Category",
    plating: "Plating",
    color: "Color",
    size: "Size",
    close: "Close",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    prev: "Previous",
    next: "Next",
    page: "Page",
    collectionLoading: "Revealing our latest collection...",
    deliveryCharge: "Delivery Charge",
    spendMoreForFreeDelivery: "Spend ₹{amount} more for FREE delivery",
    subtotal: "Subtotal",
    totalBill: "Total Bill",
    freeDelivery: "FREE",
    orderSummary: "Order Summary",
  },
  ta: {
    heroTitle: "நேர்த்தியான கவரிங் நகைகள்",
    heroSubtitle: "ஒவ்வொரு சந்தர்ப்பத்திற்கும் காலமற்ற வடிவமைப்புகள்.",
    shopNow: "இப்போதே வாங்குங்கள்",
    trending: "பிரபலமான தயாரிப்புகள்",
    categories: "வகைகள்",
    buyNow: "இப்போதே வாங்கு",
    whatsappOrder: "வாட்ஸ்அப்பில் ஆர்டர் செய்யுங்கள்",
    onlyFewLeft: "இன்னும் {stock} மட்டுமே உள்ளது!",
    addToCart: "கூடையில் சேர்",
    shopAll: "அனைத்தும்",
    viewAll: "அனைத்தையும் காட்டு",
    showing: "வகை",
    thankYou: "உங்கள் ஆர்டருக்கு நன்றி!",
    orderSuccessMsg: "உங்கள் ஆர்டர் பெறப்பட்டது. புதுப்பிப்பு விரைவில் வாட்ஸ்அப் மூலம் அனுப்பப்படும்.",
    backToHome: "மீண்டும் கடைக்குச் செல்லுங்கள்",
    sortBy: "வரிசைப்படுத்து",
    priceLowHigh: "விலை: குறைந்ததிலிருந்து அதிகம்",
    priceHighLow: "விலை: அதிகத்திலிருந்து குறைவு",
    newest: "புதியது முதலில்",
    description: "விளக்கம்",
    stockLabel: "இருப்பு நிலை",
    categoryLabel: "வகை",
    plating: "முலாம்",
    color: "நிறம்",
    size: "அளவு",
    close: "மூடு",
    inStock: "இருப்பில் உள்ளது",
    outOfStock: "இருப்பில் இல்லை",
    prev: "முந்தையது",
    next: "அடுத்தது",
    page: "பக்கம்",
    collectionLoading: "எங்கள் சமீபத்திய தொகுப்பை வெளிப்படுத்துகிறோம்...",
    deliveryCharge: "டெலிவரி கட்டணம்",
    spendMoreForFreeDelivery: "FREE டெலிவரிக்கு இன்னும் ₹{amount} செலவிடுங்கள்",
    subtotal: "துணைத் தொகை",
    totalBill: "மொத்த பில்",
    freeDelivery: "இலவசம்",
    orderSummary: "ஆர்டர் சுருக்கம்",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
