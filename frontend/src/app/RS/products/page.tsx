"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  ArrowUpDown,
  Tag,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

import { API_BASE_URL } from "@/config/apiConfig";
import Image from "next/image";
import SkeletonCard from "@/components/SkeletonCard";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this exquisite piece? This cannot be undone.")) return;
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();
    return (
      product.name_en.toLowerCase().includes(search) ||
      product.name_ta?.toLowerCase().includes(search) ||
      (product.productId && product.productId.toLowerCase().includes(search)) ||
      product._id.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-premium font-bold tracking-tight mb-2">Jewelry Inventory</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Manage your Luxury Collection</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
          {/* Search Bar */}
          <div className="relative group w-full sm:min-w-[300px]">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary/40 group-focus-within:text-gold-primary transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search..."
               className="w-full pl-12 pr-10 py-3 bg-white border border-gold-primary/10 text-xs focus:border-gold-primary outline-none transition-all shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             {searchTerm && (
               <button 
                 onClick={() => setSearchTerm("")}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-red-400 p-1 transition-colors"
                 title="Clear search"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
             )}
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchProducts();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gold-primary/20 text-gold-primary text-[10px] uppercase tracking-widest font-bold hover:bg-gold-soft/10 transition-all"
            title="Refresh Inventory"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link 
            href="/RS/products/new" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-primary text-white text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-gold-primary/20 hover:bg-gold-accent transition-all"
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add New Piece</span>
          </Link>
        </div>
      </header>


        <div className="bg-white border border-gold-primary/10 shadow-sm overflow-hidden">
          {/* Mobile View: Grid */}
          <div className="md:hidden grid grid-cols-2 gap-px bg-gold-primary/10">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-4">
                  <div className="aspect-[3/4] bg-gold-soft/10 animate-pulse mb-3" />
                  <div className="h-3 bg-gold-soft/10 animate-pulse w-3/4 mb-2" />
                  <div className="h-3 bg-gold-soft/10 animate-pulse w-1/2" />
                </div>
              ))
            ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <div key={product._id} className="bg-white flex flex-col p-4 space-y-3 hover:bg-gold-soft/5 transition-colors">
                <div className="aspect-[3/4] bg-gold-soft/20 overflow-hidden relative group">
                  <Image 
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200"} 
                    alt={product.name_en} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 right-2 z-10">
                     <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-sm border ${product.stock <= 5 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white/90 text-gold-primary border-gold-primary/20'}`}>
                        {product.stock} left
                     </span>
                  </div>
                </div>
                
                <div className="flex-grow space-y-1">
                  <p className="font-premium font-bold text-xs tracking-tight line-clamp-1">{product.name_en}</p>
                  <p className="text-[9px] font-sans text-gold-primary uppercase tracking-[0.1em] font-bold">ID: {product.productId || product._id.slice(-4)}</p>
                  <p className="text-xs font-sans font-bold text-gold-primary mt-1">₹{product.price}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gold-primary/5 gap-2">
                  <Link 
                    href={`/RS/products/edit/${product._id}`}
                    className="flex-1 py-1.5 flex justify-center text-gold-primary hover:bg-gold-soft/20 transition-colors border border-gold-primary/10" 
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 py-1.5 flex justify-center text-red-400 hover:bg-red-50 transition-colors border border-red-50" 
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-2 p-10 text-center text-foreground/30 bg-white italic text-xs uppercase tracking-widest">No pieces found.</div>
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gold-primary/20">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-gold-primary/10">
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Product</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Category</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Price</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Stock Status</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-16 bg-gold-soft/10 shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-3 bg-gold-soft/10 w-3/4" />
                          <div className="h-2 bg-gold-soft/10 w-1/2" />
                        </div>
                      </td>
                      <td className="p-6"><div className="h-4 bg-gold-soft/10 w-20" /></td>
                      <td className="p-6"><div className="h-4 bg-gold-soft/10 w-16" /></td>
                      <td className="p-6"><div className="h-4 bg-gold-soft/10 w-24" /></td>
                      <td className="p-6"><div className="h-8 bg-gold-soft/10 w-24" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gold-soft/5 transition-colors">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-16 bg-gold-soft/20 flex-shrink-0 relative">
                        <Image 
                          src={product.images?.[0] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200"} 
                          alt={product.name_en} 
                          fill
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-premium font-bold text-sm tracking-tight">{product.name_en}</p>
                        <p className="text-[10px] font-sans text-gold-primary uppercase tracking-widest mt-1 font-bold">ID: {product.productId || product._id.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="p-6 align-middle">
                      <div className="flex items-center gap-2 text-[10px] text-foreground/50 font-bold uppercase tracking-widest bg-gold-soft/10 px-3 py-1.5 w-fit">
                        <Tag size={12} className="text-gold-primary/40" />
                        {product.category}
                      </div>
                    </td>
                    <td className="p-6 align-middle font-sans font-bold text-sm text-gold-primary">
                      ₹{product.price}
                    </td>
                    <td className="p-6 align-middle">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-foreground/70'}`}>
                            {product.stock} units
                          </span>
                          {product.stock <= 5 && <AlertTriangle size={14} className="text-red-400" />}
                        </div>
                        <p className="text-[9px] text-foreground/30 uppercase tracking-widest font-bold">Warehouse A</p>
                      </div>
                    </td>
                    <td className="p-6 align-middle space-x-3">
                      <Link 
                        href={`/RS/products/edit/${product._id}`}
                        className="inline-block p-2 text-gold-primary hover:bg-gold-soft/20 transition-colors border border-gold-primary/10" 
                        title="Edit Piece"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 text-red-400 hover:bg-red-50 transition-colors border border-red-50" 
                        title="Remove Piece"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <p className="font-premium text-lg text-foreground/30 italic">No pieces found matching "{searchTerm}"</p>
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="mt-4 text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:underline"
                      >
                        Clear Search
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
