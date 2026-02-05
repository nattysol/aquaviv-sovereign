'use client';

import { useState } from 'react';
import { useCart } from '@/components/providers/CartContext';
import { Check, Loader2, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';

type VariantOption = {
  id: string;
  title: string; // e.g., "1 Bottle" or "3 Bottles"
  price: number;
  compareAtPrice?: number;
  label: string; // "Starter", "Most Popular", etc.
  savings?: string;
};

export function ProductOptionSelector({ variants }: { variants: VariantOption[] }) {
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id || '');
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Find the currently selected variant object
  const selectedVariant = variants.find(v => v.id === selectedId) || variants[0];

  const handleAddToCart = async () => {
    if (!selectedId) return;
    setIsAdding(true);
    await addToCart(selectedId, 1);
    setIsAdding(false);
  };

  if (variants.length === 0) {
    return <div className="p-4 bg-red-50 text-red-600 rounded">No variants found.</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* 1. THE SELECTOR GRID */}
      {variants.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {variants.map((v) => {
            const isSelected = selectedId === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={clsx(
                  "relative p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-1",
                  isSelected 
                    ? "border-accent bg-accent/5 shadow-md" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                {/* Floating Badge for Savings */}
                {v.savings && (
                  <span className={clsx(
                    "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                    isSelected ? "bg-accent text-primary border-accent" : "bg-green-100 text-green-700 border-green-200"
                  )}>
                    {v.savings}
                  </span>
                )}

                <div className="flex justify-between w-full items-center">
                  <span className={clsx("font-bold text-sm", isSelected ? "text-primary" : "text-slate-500")}>
                    {v.title}
                  </span>
                  {isSelected && <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center"><Check size={10} className="text-primary"/></div>}
                </div>

                <div className="flex items-baseline gap-2">
                   <span className="font-bold text-lg text-slate-900">${v.price.toFixed(2)}</span>
                   {/* Calculate 'Per Bottle' if helpful, or just show price */}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* 2. THE SUMMARY & ACTION BUTTON */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Investment</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">${selectedVariant.price.toFixed(2)}</span>
              {selectedVariant.compareAtPrice && (
                 <span className="text-sm text-slate-400 line-through">${selectedVariant.compareAtPrice}</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || isLoading}
          className="w-full py-4 bg-accent hover:bg-white text-primary hover:scale-[1.02] transition-all font-bold rounded-xl shadow-[0_0_20px_rgba(0,180,216,0.3)] flex items-center justify-center gap-2 text-lg"
        >
          {isAdding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Updating Ritual...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
        
        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-2">
          <span>30-Day Money Back Guarantee</span>
          <span>•</span>
          <span>Free Shipping</span>
        </p>
      </div>

    </div>
  );
}