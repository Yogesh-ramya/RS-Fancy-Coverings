"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  PlusCircle, 
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  RefreshCw,
  X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/RS" },
  { name: "Orders", icon: ShoppingBag, href: "/RS/orders" },
  { name: "Inventory", icon: Package, href: "/RS/products" },
  { name: "Add Product", icon: PlusCircle, href: "/RS/products/new" },
];

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, logout, isLoading } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== "/RS/login") {
      router.push("/RS/login");
    }
  }, [isAdmin, isLoading, pathname, router]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading || (!isAdmin && pathname !== "/RS/login")) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center font-premium text-2xl animate-pulse">
        Verifying Security Access...
      </div>
    );
  }

  // Hide sidebar/header on login page
  if (pathname === "/RS/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar Mobile Toggle */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-gold-primary/10 flex flex-col z-[70] transition-transform duration-300 transform md:relative md:translate-x-0 md:w-64 shadow-xl md:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-gold-primary/5 flex items-center justify-between">
          <Link href="/" className="text-xl font-premium tracking-[0.2em] font-bold gold-text-gradient">
            RS ADMIN
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-foreground/40 p-2"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto overflow-x-hidden pt-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-bold mb-4 opacity-50 px-3">Management</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-4 rounded-none transition-all group",
                  isActive 
                    ? "bg-gold-soft/30 text-gold-primary border-l-2 border-gold-primary pl-6" 
                    : "text-foreground/50 hover:bg-gold-soft/10 hover:text-gold-primary pl-4"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(isActive ? "text-gold-primary" : "text-foreground/30 group-hover:text-gold-primary")} />
                  <span className="text-xs uppercase tracking-widest font-bold">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gold-primary/5 mt-auto">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                logout();
              }
            }}
            className="flex items-center gap-3 text-foreground/40 hover:text-red-500 transition-colors p-3 w-full text-left group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col w-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gold-primary/5 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-[50] shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-foreground p-2 hover:bg-gold-soft/20 transition-colors rounded-full"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="text-[10px] sm:text-xs font-premium tracking-[0.2em] uppercase font-bold text-foreground/70 border-l-2 border-gold-primary md:border-none pl-3 md:pl-0">
              {menuItems.find(i => i.href === pathname)?.name || "Management"}
            </h2>
            
            <Link 
              href="/" 
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gold-primary/20 text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:bg-gold-soft/20 transition-all ml-4"
            >
              <ExternalLink size={12} />
              View Store
            </Link>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => router.refresh()}
              className="p-2 text-foreground/40 hover:text-gold-primary transition-colors hover:bg-gold-soft/20 rounded-full"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
            <div className="text-right hidden xs:block">
              <p className="text-[9px] uppercase tracking-widest text-gold-primary font-bold">Boutique Admin</p>
              <p className="text-[10px] text-foreground/40">Ranjani</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold-soft/50 border border-gold-primary/20 flex items-center justify-center font-premium font-bold text-gold-primary">
              R
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto">
          <div className="p-6 sm:p-10 max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminContent>{children}</AdminContent>
    </AdminAuthProvider>
  );
}
