"use client";
// Forced recompile to update QR code with new UPI ID

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { QRCodeCanvas } from "qrcode.react";
import { MapPin, CheckSquare, Square, User, Phone, Map, Hash, Flag } from "lucide-react";

import { API_BASE_URL } from "@/config/apiConfig";

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  
  const nameSummary = params.get("name") || "Jewelry Item";
  
  // Calculate subtotal from URL or Cart
  const subtotal = cartItems.length > 0 
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : Number(params.get("subtotal") || "0");

  // Consistent Delivery Logic: 50 if < 500, else 0
  const deliveryCharge = (subtotal > 0 && subtotal < 500) ? 50 : 0;
  const totalPrice = subtotal + deliveryCharge;
  
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    pincode: "",
    landmark: "",
    upiLast4: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Load saved details if any
  useEffect(() => {
    const savedData = localStorage.getItem("rs_shipping_details");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
        setRememberMe(true);
      } catch (e) {
        console.error("Error parsing saved data:", e);
      }
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OSM Nominatim for reverse geocoding (Free, but should be used responsibly)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const fullAddress = [
              addr.road,
              addr.suburb,
              addr.city || addr.town || addr.village,
              addr.state,
              addr.country
            ].filter(Boolean).join(", ");

            setFormData(prev => ({
              ...prev,
              address: fullAddress || data.display_name,
              pincode: addr.postcode || prev.pincode,
              landmark: addr.suburb || addr.neighbourhood || prev.landmark
            }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Failed to get address from location. Please enter manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const upiId = "rameshranjani410@okicici"; 
  const upiLink = `upi://pay?pa=${upiId}&pn=RSFancyCoverings&am=${totalPrice}&cu=INR`;

  const handleSubmitOrder = async () => {
    if (!formData.customerName || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill in all required shipping details (Name, Phone, Address, Pincode).");
      return;
    }

    if (paymentMethod === "UPI" && !formData.upiLast4) {
      alert("Please enter the last 4 digits of the transaction ID.");
      return;
    }

    if (paymentMethod === "UPI" && formData.upiLast4.length !== 4) {
      alert("Please enter exactly 4 digits of the transaction ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const summaryId = params.get("id");
      const sku = params.get("sku") || "";
      
      // Prepare the order data
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        landmark: formData.landmark,
        upiLast4: paymentMethod === "UPI" ? formData.upiLast4 : undefined,
        totalPrice: Number(totalPrice),
        deliveryCharge: Number(deliveryCharge),
        orderType: paymentMethod,
        items: cartItems.length > 0 ? cartItems.map(item => ({
          productId: item._id,
          sku: item.productId || "",
          name: item.name_en,
          price: item.price,
          quantity: item.quantity
        })) : [{ 
          productId: summaryId, 
          sku: sku,
          name: nameSummary, 
          price: Number(totalPrice), 
          quantity: 1 
        }]
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Save details if rememberMe is checked
        if (rememberMe) {
          const { upiLast4, ...saveData } = formData;
          localStorage.setItem("rs_shipping_details", JSON.stringify(saveData));
        } else {
          localStorage.removeItem("rs_shipping_details");
        }
        
        clearCart();
        router.push("/order-success");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Could not connect to the server. Your payment is safe, please contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white border border-gold-primary/20 p-8 shadow-xl">
          <h1 className="text-3xl font-premium font-bold mb-8 tracking-tight text-center">Checkout & Shipping</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Step 1: Shipping Details */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-4">1. Shipping Information</h2>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-primary/40" size={16} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-3 py-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-primary/40" size={16} />
                  <input
                    type="text"
                    placeholder="Whatsapp Number"
                    className="w-full pl-10 pr-3 py-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="w-full py-2.5 border border-dashed border-gold-primary/30 text-gold-primary text-[10px] uppercase tracking-widest font-bold hover:bg-gold-soft/10 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <MapPin size={14} className={isLocating ? "animate-bounce" : "group-hover:scale-110 transition-transform"} />
                    {isLocating ? "Locating..." : "Use Live Location"}
                  </button>
                </div>

                <div className="relative">
                  <Map className="absolute left-3 top-4 text-gold-primary/40" size={16} />
                  <textarea
                    placeholder="Shipping Address"
                    rows={3}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-primary/40" size={16} />
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="w-full pl-10 pr-3 py-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-primary/40" size={16} />
                    <input
                      type="text"
                      placeholder="Landmark"
                      className="w-full pl-10 pr-3 py-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 hover:text-gold-primary transition-colors mt-2"
                >
                  {rememberMe ? <CheckSquare size={16} className="text-gold-primary" /> : <Square size={16} />}
                  Remember my details
                </button>
              </div>

              <div className="p-4 bg-gold-soft/20 border border-gold-primary/10 mt-8 space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-foreground/60">
                  <span>Subtotal</span>
                  <span className="font-sans">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-foreground/60 pb-2 border-b border-gold-primary/10">
                  <span>Delivery</span>
                  <span className="font-sans">{Number(deliveryCharge) === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
                {deliveryCharge > 0 && (
                  <div className="py-2 px-3 bg-gold-primary/5 rounded-sm border border-gold-primary/10 animate-pulse">
                    <p className="text-[9px] uppercase tracking-wider text-gold-primary font-bold text-center">
                      Add ₹{500 - subtotal} more for <span className="underline underline-offset-2">FREE Delivery!</span>
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-[10px] uppercase tracking-widest text-gold-primary font-bold">Total Bill</p>
                  <p className="text-2xl font-bold font-sans text-gold-primary">₹{totalPrice}</p>
                </div>
                <p className="text-[9px] text-foreground/50 mt-1 italic">{nameSummary}</p>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-4">2. Payment Method</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setPaymentMethod("UPI")}
                  className={`py-3 px-4 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                    paymentMethod === "UPI" 
                      ? "bg-gold-primary text-white border-gold-primary shadow-md" 
                      : "bg-white text-gold-primary border-gold-primary/20 hover:border-gold-primary/50"
                  }`}
                >
                  UPI / QR Scan
                </button>
                <button
                  onClick={() => setPaymentMethod("COD")}
                  className={`py-3 px-4 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                    paymentMethod === "COD" 
                      ? "bg-gold-primary text-white border-gold-primary shadow-md" 
                      : "bg-white text-gold-primary border-gold-primary/20 hover:border-gold-primary/50"
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>

              {paymentMethod === "UPI" ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white p-6 text-center border border-gold-primary/10 shadow-sm flex flex-col items-center">
                    <div className="p-4 bg-white border border-gold-primary/10 shadow-inner rounded-sm mb-4">
                      <QRCodeCanvas
                        value={upiLink}
                        size={180}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                          src: "/rs-logo.png",
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gold-primary">Scan to Pay ₹{totalPrice}</p>
                      <a 
                        href={upiLink} 
                        className="block text-[9px] uppercase tracking-widest text-foreground/40 hover:text-gold-primary underline transition-colors"
                      >
                        Click to pay with UPI App
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Enter Last 4 Digits of Transaction ID</p>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      className="w-full p-3 bg-background border border-gold-primary/10 text-lg font-mono text-center tracking-[0.5em] focus:border-gold-primary outline-none"
                      value={formData.upiLast4}
                      onChange={(e) => setFormData({ ...formData, upiLast4: e.target.value.replace(/\D/g, "") })}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-gold-soft/10 border border-dashed border-gold-primary/30 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="w-12 h-12 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-gold-primary text-xl">🚚</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-gold-primary">Cash on Delivery Selected</p>
                    <p className="text-[10px] text-foreground/60 leading-relaxed">
                      Pay the total amount of <span className="font-bold text-foreground">₹{totalPrice}</span> in cash at the time of delivery.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full py-4 mt-4 uppercase tracking-[0.2em] text-[11px] font-bold transition-all shadow-lg ${
                  isSubmitting ? "bg-gray-400" : "bg-gold-primary text-white hover:bg-gold-accent shadow-gold-primary/20"
                }`}
              >
                {isSubmitting ? "Processing..." : paymentMethod === "UPI" ? "Confirm Payment & Order" : "Place Order (COD)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-premium text-2xl">Loading Payment System...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
