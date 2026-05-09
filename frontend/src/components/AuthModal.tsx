"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, Phone, X, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import { usePathname } from "next/navigation";

type ViewState = "login" | "signup" | "forgot";

export default function AuthModal() {
  const { showModal, dismissModal, login } = useUserAuth();
  const pathname = usePathname();
  
  const [view, setView] = useState<ViewState>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Don't render modal at all on admin pages
  if (pathname?.startsWith("/RS") || pathname?.startsWith("/admin")) {
    return null;
  }

  // Form states
  const [identifier, setIdentifier] = useState(""); // Username, Email, or Phone for login
  const [password, setPassword] = useState("");
  
  // Signup specific
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Reset errors when view changes
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [view]);

  // Mock API Call
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (view === "signup") {
        if (!username || !email || !phone || !password) {
          throw new Error("Please fill all fields.");
        }
        
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, phone, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Signup failed");

        login({ name: data.user.username, email: data.user.email, phone: data.user.phone });
        setSuccess("Account created successfully!");
        
      } else if (view === "login") {
        if (!identifier || !password) {
          throw new Error("Please enter your credentials.");
        }
        
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        login({ name: data.user.username, email: data.user.email, phone: data.user.phone });
        setSuccess("Logged in successfully!");
        
      } else if (view === "forgot") {
        if (!identifier) {
          throw new Error("Please enter your email or phone number.");
        }
        
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to process request");

        setSuccess(data.message);
        setTimeout(() => {
          setView("login");
          setSuccess("");
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-transparent transition-all";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40";

  return (
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={dismissModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[420px] bg-[#111] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl z-[100] flex flex-col items-center"
          >
            <button
              onClick={dismissModal}
              className="absolute right-5 top-5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 bg-gradient-to-tr from-gold-primary/20 to-gold-accent/20 rounded-full flex items-center justify-center mb-6 border border-gold-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              {view === "forgot" ? (
                <KeyRound className="w-7 h-7 text-gold-primary" />
              ) : (
                <User className="w-7 h-7 text-gold-primary" />
              )}
            </div>

            <h2 className="text-3xl font-premium tracking-wide text-white mb-2">
              {view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="text-white/60 mb-8 font-light text-center text-sm px-4">
              {view === "login" 
                ? "Enter your credentials to access your account." 
                : view === "signup" 
                ? "Join us to save favorites and track orders."
                : "Enter your phone or email to recover your account."}
            </p>

            <form onSubmit={handleAction} className="w-full space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-400 text-sm text-center bg-green-400/10 py-2 rounded-lg border border-green-400/20">
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {view === "signup" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  <div className="relative">
                    <User className={iconClasses} />
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className={inputClasses} required />
                  </div>
                  <div className="relative">
                    <Mail className={iconClasses} />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} required />
                  </div>
                  <div className="relative">
                    <Phone className={iconClasses} />
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} required />
                  </div>
                </motion.div>
              )}

              {(view === "login" || view === "forgot") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                  <User className={iconClasses} />
                  <input 
                    type="text" 
                    placeholder={view === "forgot" ? "Email or Phone Number" : "Username, Email, or Phone"} 
                    value={identifier} 
                    onChange={e => setIdentifier(e.target.value)} 
                    className={inputClasses} 
                    required 
                  />
                </motion.div>
              )}

              {view !== "forgot" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                  <Lock className={iconClasses} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className={inputClasses} 
                    required 
                  />
                </motion.div>
              )}

              {view === "login" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setView("forgot")} className="text-xs text-white/50 hover:text-gold-primary transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-primary to-gold-accent text-black py-3.5 px-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-70 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Reset Password"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 w-full flex flex-col items-center gap-4">
              <p className="text-sm text-white/50">
                {view === "login" ? "Don't have an account?" : view === "signup" ? "Already have an account?" : "Remember your password?"}
                <button 
                  onClick={() => setView(view === "login" ? "signup" : "login")} 
                  className="ml-2 text-gold-primary hover:text-gold-accent font-medium transition-colors"
                >
                  {view === "login" ? "Sign Up" : "Log In"}
                </button>
              </p>

              <button
                onClick={dismissModal}
                className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm"
              >
                Continue as Guest
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
