import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-premium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RS Fancy Coverings | Luxury Gold Plated Jewelry",
  description: "Exquisite Gold-Plated Earrings, Necklaces, and Bangles. Shop online or order via WhatsApp. Quality craftsmanship from Tamil Nadu.",
  keywords: ["gold plated jewelry", "luxury earrings", "bangles", "necklaces", "RS Fancy Coverings", "Tamil Nadu jewelry"],
  authors: [{ name: "RS Fancy Coverings" }],
  openGraph: {
    title: "RS Fancy Coverings | Luxury Gold Plated Jewelry",
    description: "Exquisite Gold-Plated Earrings, Necklaces, and Bangles. Quality craftsmanship from Tamil Nadu.",
    url: "https://rs-fancy-coverings.vercel.app",
    siteName: "RS Fancy Coverings",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RS Fancy Coverings Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RS Fancy Coverings | Luxury Gold Plated Jewelry",
    description: "Exquisite Gold-Plated Earrings, Necklaces, and Bangles.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-background text-foreground">
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
