"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  Phone,
  MapPin,
  CreditCard,
  Trash2
} from "lucide-react";

import { API_BASE_URL } from "@/config/apiConfig";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await res.json();
      setOrders(data.reverse());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  const deleteOrder = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This action is permanent and cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-orange-500 bg-orange-50 border-orange-100";
      case "Processing": return "text-blue-500 bg-blue-50 border-blue-100";
      case "Shipped": return "text-purple-500 bg-purple-50 border-purple-100";
      case "Completed": return "text-green-500 bg-green-50 border-green-100";
      default: return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-premium font-bold tracking-tight mb-2">Order Fulfillment</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Manage & Verify UPI Payments</p>
        </div>
        <div className="relative w-full sm:w-auto mt-4 sm:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-gold-primary/10 text-xs focus:border-gold-primary outline-none transition-all w-full sm:w-64 shadow-sm"
          />
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center font-premium text-xl text-foreground/20 italic">Loading your orders...</div>
      ) : (
        <div className="bg-white border border-gold-primary/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gold-primary/20">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-gold-primary/10">
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Order Date</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Customer Details</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Items</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Transaction (UPI 4)</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Total Price</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Status</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gold-soft/5 transition-colors">
                  <td className="p-6 text-xs text-foreground/60 align-top">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="p-6 align-top">
                    <div className="space-y-2">
                      <p className="font-premium font-bold text-sm tracking-tight capitalize">{order.customerName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                        <Phone size={12} className="text-gold-primary/40" />
                        {order.phone}
                      </div>
                      <div className="flex items-start gap-2 text-[10px] text-foreground/40 uppercase tracking-widest mt-1 max-w-[180px]">
                        <MapPin size={12} className="text-gold-primary/40 flex-shrink-0" />
                        {order.address}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="space-y-1">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="text-[11px] font-sans leading-relaxed text-foreground/70">
                          <p>
                            {item.name} <span className="text-gold-primary font-bold">x{item.quantity}</span>
                          </p>
                          {item.sku && (
                            <p className="text-[9px] text-gold-primary font-bold uppercase tracking-wider">SKU: {item.sku}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-gold-primary/10 rounded-none shadow-sm font-mono text-sm font-bold text-gold-primary tracking-widest">
                      <CreditCard size={14} className="text-gold-primary/40" />
                      {order.upiLast4 || "N/A"}
                    </div>
                  </td>
                  <td className="p-6 align-top font-sans font-bold text-sm text-gold-primary">
                    ₹{order.totalPrice}
                  </td>
                  <td className="p-6 align-top">
                    <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border border-dashed rounded-none ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 align-top space-x-2 flex">
                    {order.status === "Pending" && (
                      <button 
                        onClick={() => updateStatus(order._id, "Processing")}
                        className="p-2 text-blue-500 hover:bg-blue-50 transition-colors border border-blue-100" 
                        title="Start Processing"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    {order.status === "Processing" && (
                      <button 
                        onClick={() => updateStatus(order._id, "Shipped")}
                        className="p-2 text-purple-500 hover:bg-purple-50 transition-colors border border-purple-100" 
                        title="Ship Order"
                      >
                        <Truck size={16} />
                      </button>
                    )}
                    {order.status === "Shipped" && (
                      <button 
                        onClick={() => updateStatus(order._id, "Completed")}
                        className="p-2 text-green-500 hover:bg-green-50 transition-colors border border-green-100" 
                        title="Mark Completed"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => updateStatus(order._id, "Cancelled")}
                      className="p-2 text-red-500 hover:bg-red-50 transition-colors border border-red-100" 
                      title="Cancel Order"
                    >
                      <XCircle size={16} />
                    </button>
                    <button 
                      onClick={() => deleteOrder(order._id)}
                      className="p-2 text-red-600 hover:bg-red-100 transition-colors border border-red-200" 
                      title="Delete Order (Permanent)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
