"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (p: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("rs_admin_auth");
    if (authStatus === "true") {
      setIsAdmin(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string) => {
    // For now, using a direct password check. 
    // In production, this should match an environment variable or backend call.
    if (password === "admin") {
      setIsAdmin(true);
      sessionStorage.setItem("rs_admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("rs_admin_auth");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
