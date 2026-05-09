"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
}

interface UserAuthContextType {
  user: UserInfo | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  login: (userData: UserInfo) => void;
  logout: () => void;
  dismissModal: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage for user or dismissed state
    const storedUser = localStorage.getItem("rs_user");
    const isDismissed = localStorage.getItem("rs_auth_dismissed");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    } else if (!isDismissed) {
      // If no user and not dismissed, show modal after a short delay
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500);
      
      setIsInitialized(true);
      return () => clearTimeout(timer);
    }
    
    setIsInitialized(true);
  }, []);

  const login = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem("rs_user", JSON.stringify(userData));
    localStorage.removeItem("rs_auth_dismissed");
    setShowModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rs_user");
    // Show modal again on logout? Or maybe not immediately.
    setShowModal(true);
  };

  const dismissModal = () => {
    localStorage.setItem("rs_auth_dismissed", "true");
    setShowModal(false);
  };

  return (
    <UserAuthContext.Provider value={{ user, showModal, setShowModal, login, logout, dismissModal }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}
