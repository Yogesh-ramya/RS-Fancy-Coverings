import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gold-primary/5 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="aspect-[4/5] bg-gold-soft/10 relative" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gold-soft/20 w-3/4 rounded" />
          <div className="h-4 bg-gold-soft/20 w-1/2 rounded" />
        </div>
        <div className="h-10 bg-gold-soft/20 w-full rounded" />
        <div className="h-10 bg-gold-soft/20 w-full rounded" />
      </div>
    </div>
  );
}
