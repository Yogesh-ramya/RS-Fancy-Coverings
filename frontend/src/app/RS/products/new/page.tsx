"use client";

import React, { useState, useRef } from "react";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  Plus,
  Scissors,
  Move,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { translateText } from "@/utils/translate";


import { API_BASE_URL } from "@/config/apiConfig";

export default function NewProductAdmin() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    name_en: "",
    name_ta: "",
    productId: "",
    description_en: "",
    description_ta: "",
    price: "",
    stock: "",
    category: "Earrings",
    images: [""] // Used for manual URL input
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Photo Studio State
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleAutoTranslate = async (field: 'name' | 'description', sourceLang: 'en' | 'ta') => {
    const targetLang = sourceLang === 'en' ? 'ta' : 'en';
    const sourceValue = formData[`${field}_${sourceLang}` as keyof typeof formData] as string;
    const targetValue = formData[`${field}_${targetLang}` as keyof typeof formData] as string;

    // Only translate if source has value and target is empty
    if (sourceValue && !targetValue) {
      const translated = await translateText(sourceValue, sourceLang, targetLang);
      if (translated) {
        setFormData(prev => ({
          ...prev,
          [`${field}_${targetLang}`]: translated
        }));
      }
    }
  };

  const handleCropSave = () => {
    if (editingIndex === null || !previews[editingIndex]) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previews[editingIndex];

    img.onload = () => {
      // 4:5 Aspect Ratio (800x1000)
      canvas.width = 800;
      canvas.height = 1000;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const targetWidth = canvas.width * zoom;
      const targetHeight = (img.height * (canvas.width / img.width)) * zoom;

      const x = (canvas.width - targetWidth) / 2 + offset.x;
      const y = (canvas.height - targetHeight) / 2 + offset.y;

      ctx.drawImage(img, x, y, targetWidth, targetHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `product-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const newFiles = [...selectedFiles];
          newFiles[editingIndex] = file;
          setSelectedFiles(newFiles);

          const newPreviews = [...previews];
          newPreviews[editingIndex] = URL.createObjectURL(blob);
          setPreviews(newPreviews);
          
          setIsPhotoStudioOpen(false);
          setEditingIndex(null);
        }
      }, 'image/jpeg', 0.95);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalProductId = formData.productId || `RS-${Math.floor(10000 + Math.random() * 90000)}`;

    const data = new FormData();
    data.append("name_en", formData.name_en);
    data.append("name_ta", formData.name_ta);
    data.append("productId", finalProductId);
    data.append("description_en", formData.description_en);
    data.append("description_ta", formData.description_ta);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    
    // Append files
    selectedFiles.forEach(file => {
      data.append("images", file);
    });

    // If no files selected but URL is provided, send the URL
    if (selectedFiles.length === 0 && formData.images[0]) {
      data.append("images", formData.images[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        body: data
      });
      if (res.ok) {
        alert(`Jewelry piece added! Product ID: ${finalProductId}`);
        router.push("/RS/products");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/RS/products" className="p-2 text-foreground/40 hover:text-gold-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-premium font-bold tracking-tight mb-1">Add New Jewel</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Create a masterpiece</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gold-primary/10 p-10 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-6">1. Catalog Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gold-primary">Product ID / SKU</label>
                <input 
                  type="text" 
                  placeholder="e.g. RS-101"
                  className="w-full p-4 bg-background border border-gold-primary/20 text-sm focus:border-gold-primary outline-none transition-all font-bold"
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Name (English)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Elegant Gold Jhumkas"
                  className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  onBlur={() => handleAutoTranslate('name', 'en')}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Name (Tamil)</label>
                <input 
                  type="text" 
                  required
                  placeholder="நேர்த்தியான தங்க ஜிமிக்கி"
                  className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                  value={formData.name_ta}
                  onChange={(e) => setFormData({...formData, name_ta: e.target.value})}
                  onBlur={() => handleAutoTranslate('name', 'ta')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Description (English)</label>
              <textarea 
                rows={4}
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                value={formData.description_en}
                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                onBlur={() => handleAutoTranslate('description', 'en')}
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Description (Tamil)</label>
              <textarea 
                rows={4}
                placeholder="உயர்தர தங்க முலாம் பூசிய ஜிமிக்கிகள்..."
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                value={formData.description_ta}
                onChange={(e) => setFormData({...formData, description_ta: e.target.value})}
                onBlur={() => handleAutoTranslate('description', 'ta')}
              />
            </div>
          </div>

          <div className="bg-white border border-gold-primary/10 p-10 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-6">2. Visual Assets</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 block">Product Photos (Up to 5)</label>
                <label className="cursor-pointer flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-gold-primary/20 bg-gold-soft/5 text-gold-primary hover:bg-gold-soft/20 transition-all w-full">
                  <Plus size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Select Masterpiece Photos</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div className="relative border-t border-gold-primary/5 pt-6">
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-white px-4 text-[9px] uppercase tracking-widest text-foreground/20 font-bold">OR</div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 block mb-4">Paste Image URL (Fallback)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-12 pr-4 py-4 bg-background border border-gold-primary/10 text-xs focus:border-gold-primary outline-none transition-all"
                    value={formData.images[0]}
                    onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                  />
                </div>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative aspect-square bg-gold-soft/10 border border-gold-primary/10 overflow-hidden group">
                      <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingIndex(i);
                            setZoom(1);
                            setOffset({ x: 0, y: 0 });
                            setIsPhotoStudioOpen(true);
                          }}
                          className="px-3 py-1.5 bg-gold-primary text-white text-[8px] uppercase tracking-widest font-bold hover:bg-gold-accent transition-all"
                        >
                          Studio Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gold-primary/10 p-10 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-6">3. Inventory</h2>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Category</label>
              <select 
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {["Earrings", "Necklaces", "Bangles", "Others"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Price (₹)</label>
              <input 
                type="number" required
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm font-bold"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Stock</label>
              <input 
                type="number" required
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm font-bold"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-gold-primary text-white uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-gold-accent shadow-lg shadow-gold-primary/20"
            >
              {loading ? "Adding..." : "Save Masterpiece"}
            </button>
          </div>
        </div>
      </form>

      {/* Photo Studio Modal */}
      {isPhotoStudioOpen && editingIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative">
            <button 
              onClick={() => setIsPhotoStudioOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gold-primary transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-bold"
            >
              Close Studio
            </button>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              <div className="flex-grow bg-gold-soft/5 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="relative w-full max-w-[400px] aspect-[4/5] bg-white shadow-2xl border border-gold-primary/20 overflow-hidden">
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-move"
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      transition: 'none'
                    }}
                  >
                    <img 
                      src={previews[editingIndex]} 
                      alt="To crop" 
                      className="max-w-none pointer-events-none"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none border border-gold-primary/10 grid grid-cols-3 grid-rows-3 opacity-30">
                    {[...Array(9)].map((_, i) => <div key={i} className="border border-gold-primary/20" />)}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="w-full md:w-80 p-8 border-l border-gold-primary/10 space-y-10 bg-white overflow-y-auto h-full">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gold-primary flex items-center gap-2">
                    <Scissors size={14} /> Zoom Level
                  </label>
                  <input 
                    type="range" min="1" max="3" step="0.01" className="w-full accent-gold-primary"
                    value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] font-bold text-foreground/20">
                    <span>1.0x</span><span>3.0x</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gold-primary flex items-center gap-2">
                    <Move size={14} /> Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'TL', x: -50, y: -50 }, { label: 'T', x: 0, y: -50 }, { label: 'TR', x: 50, y: -50 },
                      { label: 'L', x: -50, y: 0 }, { label: 'C', x: 0, y: 0 }, { label: 'R', x: 50, y: 0 },
                      { label: 'BL', x: -50, y: 50 }, { label: 'B', x: 0, y: 50 }, { label: 'BR', x: 50, y: 50 }
                    ].map(pos => (
                      <button 
                        key={pos.label} type="button"
                        onClick={() => setOffset({ x: pos.x * (zoom * 2), y: pos.y * (zoom * 2) })}
                        className="py-3 text-[9px] font-bold border border-gold-primary/10 hover:border-gold-primary hover:bg-gold-soft/10 transition-all"
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-gold-primary/5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gold-primary">Manual Adjustment</label>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-bold text-foreground/40 uppercase">
                      <span>Horizontal</span><span>{offset.x}px</span>
                    </div>
                    <input 
                      type="range" min="-200" max="200" className="w-full accent-gold-primary"
                      value={offset.x} onChange={(e) => setOffset({ ...offset, x: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-bold text-foreground/40 uppercase">
                      <span>Vertical</span><span>{offset.y}px</span>
                    </div>
                    <input 
                      type="range" min="-250" max="250" className="w-full accent-gold-primary"
                      value={offset.y} onChange={(e) => setOffset({ ...offset, y: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleCropSave}
                  className="w-full py-5 bg-gold-primary text-white uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-gold-accent transition-all shadow-xl shadow-gold-primary/20 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Done & Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
