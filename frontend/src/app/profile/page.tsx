"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { User, Phone, MapPin, Hash, Flag, ShoppingBag, Clock, CheckCircle, Truck, Package, XCircle, Plus, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config/apiConfig";
import { useUserAuth } from "@/context/UserAuthContext";

interface OrderItem {
  productId: any;
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderType: string;
}

export default function ProfilePage() {
  const { user, logout: authLogout } = useUserAuth();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Priority: Use locally saved shipping details
    const savedData = localStorage.getItem("rs_shipping_details");
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserDetails(parsed);
        setEditFormData(parsed);
        fetchOrders(parsed.phone);
        return;
      } catch (e) {
        console.error("Error parsing saved data:", e);
      }
    }

    // 2. Secondary: Use account details from login/signup
    if (user) {
      const basicData = {
        customerName: user.name,
        email: user.email,
        phone: user.phone,
        address: "",
        pincode: "",
        landmark: ""
      };
      setUserDetails(basicData);
      setEditFormData(basicData);
      fetchOrders(user.phone);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSaveDetails = () => {
    if (!editFormData.customerName || !editFormData.phone || !editFormData.address) {
      alert("Name, Phone, and Address are required.");
      return;
    }
    localStorage.setItem("rs_shipping_details", JSON.stringify(editFormData));
    setUserDetails(editFormData);
    setIsEditing(false);
    
    // If phone changed, re-fetch orders
    if (editFormData.phone !== userDetails.phone) {
      setLoading(true);
      fetchOrders(editFormData.phone);
    }
  };

  const fetchOrders = async (phone: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/customer/${encodeURIComponent(phone)}`);
      if (!res.ok) throw new Error("Failed to fetch order history");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Could not load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={14} className="text-amber-500" />;
      case 'Processing': return <Package size={14} className="text-blue-500" />;
      case 'Shipped': return <Truck size={14} className="text-purple-500" />;
      case 'Completed': return <CheckCircle size={14} className="text-green-500" />;
      case 'Cancelled': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from your luxury account?")) {
      authLogout();
      localStorage.removeItem("rs_shipping_details");
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40">
          <div className="w-12 h-12 border-2 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin" />
          <p className="mt-4 font-premium text-gold-primary italic">Gathering your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gold-primary/10 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-premium font-bold tracking-tight mb-2">My Profile</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold-primary font-bold opacity-60">Personal Boutique & History</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-red-500 border border-red-100 hover:bg-red-50 transition-all mb-1"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {!userDetails ? (
          <div className="text-center py-20 bg-white border border-gold-primary/10 shadow-sm">
            <User size={60} className="mx-auto text-gold-primary/20 mb-6" />
            <h2 className="text-2xl font-premium mb-4">Welcome to RS Fancy Coverings</h2>
            <p className="text-foreground/50 max-w-md mx-auto mb-8">
              It looks like you haven't saved your details yet. Your profile will automatically populate once you place your first order and select "Remember my details".
            </p>
            <button 
              onClick={() => window.location.href = '/#products'}
              className="px-8 py-4 bg-gold-primary text-white uppercase tracking-widest text-xs font-bold shadow-lg shadow-gold-primary/20 hover:bg-gold-accent transition-all"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar: Details */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-gold-primary/20 p-8 shadow-xl relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-soft/5 -rotate-45 translate-x-16 -translate-y-16" />
                
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary flex items-center gap-2">
                    <User size={14} /> Shipping Identity
                  </h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:text-gold-accent transition-colors flex items-center gap-1.5"
                    >
                      <Plus size={12} /> Edit Details
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Full Name</label>
                      <input 
                        type="text"
                        className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                        value={editFormData.customerName}
                        onChange={(e) => setEditFormData({...editFormData, customerName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Whatsapp</label>
                      <input 
                        type="text"
                        className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all font-sans"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Address</label>
                      <textarea 
                        rows={3}
                        className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Pincode</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all font-sans"
                          value={editFormData.pincode}
                          onChange={(e) => setEditFormData({...editFormData, pincode: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Landmark</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                          value={editFormData.landmark}
                          onChange={(e) => setEditFormData({...editFormData, landmark: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={handleSaveDetails}
                        className="flex-grow py-3 bg-gold-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold-accent transition-all"
                      >
                        Save Details
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditFormData(userDetails);
                        }}
                        className="px-4 py-3 border border-gold-primary/10 text-foreground/40 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-soft/10 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Full Name</label>
                      <p className="text-lg font-premium border-b border-gold-primary/5 pb-2 group-hover:border-gold-primary/30 transition-colors">
                        {userDetails.customerName}
                      </p>
                    </div>

                    <div className="group">
                      <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Whatsapp</label>
                      <div className="flex items-center gap-2 text-lg font-sans border-b border-gold-primary/5 pb-2 group-hover:border-gold-primary/30 transition-colors">
                        <Phone size={14} className="text-gold-primary/40" />
                        {userDetails.phone}
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Default Address</label>
                      <div className="flex items-start gap-2 text-sm leading-relaxed border-b border-gold-primary/5 pb-2 group-hover:border-gold-primary/30 transition-colors">
                        <MapPin size={14} className="text-gold-primary/40 mt-1 flex-shrink-0" />
                        {userDetails.address || <span className="italic text-foreground/20">Not set</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Pincode</label>
                        <div className="flex items-center gap-2 text-sm font-sans border-b border-gold-primary/5 pb-2 group-hover:border-gold-primary/30 transition-colors">
                          <Hash size={14} className="text-gold-primary/40" />
                          {userDetails.pincode || "---"}
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">Landmark</label>
                        <div className="flex items-center gap-2 text-sm border-b border-gold-primary/5 pb-2 group-hover:border-gold-primary/30 transition-colors">
                          <Flag size={14} className="text-gold-primary/40" />
                          {userDetails.landmark || "None"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-gold-primary/10 text-center">
                   <p className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold mb-4">Member Since</p>
                   <p className="text-xs font-sans text-gold-primary font-bold">{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Main: Order History */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary flex items-center gap-2">
                  <ShoppingBag size={14} /> Recent Acquisitions
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">{orders.length} Orders Found</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-20 text-center bg-white border border-gold-primary/10 shadow-sm">
                  <ShoppingBag size={40} className="mx-auto text-gold-primary/10 mb-4" />
                  <p className="text-foreground/40 uppercase tracking-widest text-[11px] font-bold">No orders found for this account yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <motion.div 
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white border border-gold-primary/10 p-6 sm:p-8 hover:shadow-xl hover:border-gold-primary/30 transition-all duration-500 group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gold-primary/5">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 font-bold mb-1">Order Ref</p>
                          <p className="text-xs font-sans font-bold tracking-widest group-hover:text-gold-primary transition-colors">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 font-bold mb-1">Date</p>
                            <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 font-bold mb-1">Status</p>
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gold-soft/20 flex-shrink-0 flex items-center justify-center">
                                <Package size={16} className="text-gold-primary/40" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-sans font-bold text-sm">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gold-primary/5">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Payment via</p>
                          <p className="text-[10px] font-bold text-gold-primary tracking-widest uppercase">{order.orderType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">Investment Total</p>
                          <p className="text-xl font-bold text-gold-primary font-sans">₹{order.totalPrice}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
