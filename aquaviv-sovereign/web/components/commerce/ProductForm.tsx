'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, ShieldCheck, Truck, Leaf, Loader2, Lock, Check } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormProps {
  basePrice?: number;
  variantIds?: {
    bottle1: string;
    bottle3: string;
    bottle6: string;
  };
  shopName?: string;
}

export function ProductForm({ 
  basePrice = 29.95, // Updated default from your screenshot
  variantIds,
  shopName = 'aquaviv.myshopify.com'
}: ProductFormProps) {
  
  const [isLoading, setIsLoading] = useState(false);

  // Define Bundles
  const bundles = useMemo(() => [
    {
      id: '1-bottle',
      title: '1 Bottle',
      subtitle: 'Starter Supply (30 Days)',
      price: basePrice,
      discount: 0,
      variantId: variantIds?.bottle1,
    },
    {
      id: '3-bottles',
      title: '3 Bottles',
      subtitle: 'Quarterly Protocol',
      price: (basePrice * 3) * 0.85, 
      discount: 15,
      variantId: variantIds?.bottle3,
    },
    {
      id: '6-bottles',
      title: '6 Bottles',
      subtitle: 'Complete Sovereignty',
      price: (basePrice * 6) * 0.75, 
      discount: 25,
      bestValue: true,
      variantId: variantIds?.bottle6,
    },
  ], [basePrice, variantIds]);

  const [selectedId, setSelectedId] = useState('6-bottles');
  const selectedBundle = bundles.find(b => b.id === selectedId) || bundles[2];

  const handleCheckout = () => {
    if (!selectedBundle.variantId) {
      alert("Shopify Variant ID is missing! Check Sanity.");
      return;
    }
    setIsLoading(true);
    const checkoutUrl = `https://${shopName}/cart/${selectedBundle.variantId}:1`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ZONE 1: THE MENU (Select Supply) */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
           <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Supply</p>
           {selectedBundle.discount > 0 && (
             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
               You are saving {selectedBundle.discount}%
             </span>
           )}
        </div>

        <div className="flex flex-col gap-3">
          {bundles.map((bundle) => {
            const isSelected = selectedId === bundle.id;
            
            return (
              <button
                key={bundle.id}
                onClick={() => setSelectedId(bundle.id)}
                className={clsx(
                  "relative flex items-center p-4 border rounded-xl text-left transition-all duration-200 group w-full",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-inner" 
                    : "border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm"
                )}
              >
                {/* Best Value Badge */}
                {bundle.bestValue && (
                  <span className="absolute -top-3 right-4 bg-accent text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm z-10">
                    Most Popular
                  </span>
                )}
                
                {/* Radio Circle */}
                <div className={clsx(
                  "size-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors shrink-0",
                  isSelected ? "border-primary bg-primary" : "border-slate-200 group-hover:border-primary/50"
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={clsx("font-bold text-lg", isSelected ? "text-primary" : "text-slate-700")}>
                      {bundle.title}
                    </span>
                    <div className="text-right">
                       {bundle.discount > 0 && (
                         <span className="block text-xs text-slate-400 line-through decoration-slate-300">
                           ${(bundle.price / (1 - bundle.discount/100)).toFixed(2)}
                         </span>
                       )}
                       <span className="font-bold text-slate-900 block">
                         ${bundle.price.toFixed(2)}
                       </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    {bundle.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ZONE 2: THE ACTION (Checkout Button) */}
      <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
        <button 
          onClick={handleCheckout}
          disabled={isLoading}
          className="group relative w-full bg-primary hover:bg-[#002a55] text-white font-bold text-lg h-16 rounded-xl shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-between px-6 active:scale-[0.99] overflow-hidden"
        >
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

          {isLoading ? (
            <div className="w-full flex justify-center items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting to Secure Checkout...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-primary-200 uppercase tracking-wide">Total Total</span>
                <span>${selectedBundle.price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Secure Checkout</span>
                <Lock className="w-4 h-4 text-accent" />
              </div>
            </>
          )}
        </button>
        
        {/* Trust Signals */}
        <div className="flex justify-between px-2 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
           <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Free Shipping</span>
           <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Money Back Guarantee</span>
           <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> Carbon Neutral</span>
        </div>
      </div>
    </div>
  );
}