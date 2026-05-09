"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      router.push("/RS");
    }
  }, [isAdmin, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = login(password);
    if (success) {
      router.push("/RS");
    } else {
      setError("Invalid administrative credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-primary blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white border border-gold-primary/20 p-12 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-soft/30 border border-gold-primary/20 mb-6">
              <ShieldCheck className="text-gold-primary" size={32} />
            </div>
            <h1 className="text-3xl font-premium font-bold tracking-[0.1em] mb-2 uppercase">RS Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Secure Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 ml-1">Administrative Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary/40" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary/40 hover:text-gold-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500 bg-red-50 p-4 border border-red-100 text-[11px] font-bold uppercase tracking-wider"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-gold-primary text-white uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-gold-accent transition-all shadow-xl shadow-gold-primary/20 active:scale-[0.98]"
            >
              Verify & Enter
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] uppercase tracking-widest text-foreground/30 font-medium">
              Authorized Personnel Only • RS Fancy Coverings
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
