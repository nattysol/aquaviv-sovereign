'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, ShieldCheck, Truck, Leaf, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ProductFormProps {
  basePrice?: number;
  variantIds?: {
    bottle1: string;
    bottle3: string;
    bottle6: string;
  };
  shopName?: string; // e.g. 'aquaviv.myshopify.com'
}

export function ProductForm({ 
  basePrice = 45.00, 
  variantIds,
  shopName = 'your-store-name.myshopify.com' // CHANGE THIS LATER
}: ProductFormProps) {
  
  const [isLoading, setIsLoading] = useState(false);

  // Define Bundles
  const bundles = useMemo(() => [
    {
      id: '1-bottle',
      title: '1 Bottle',
      subtitle: 'Standard Supply (30 Days)',
      price: basePrice,
      discount: 0,
      variantId: variantIds?.bottle1,
    },
    {
      id: '3-bottles',
      title: '3 Bottles',
      subtitle: 'Quarterly Supply',
      price: (basePrice * 3) * 0.85, 
      discount: 15,
      variantId: variantIds?.bottle3,
    },
    {
      id: '6-bottles',
      title: '6 Bottles',
      subtitle: 'Full Regimen',
      price: (basePrice * 6) * 0.75, 
      discount: 25,
      bestValue: true,
      variantId: variantIds?.bottle6,
    },
  ], [basePrice, variantIds]);

  const [selectedId, setSelectedId] = useState('6-bottles');
  const selectedBundle = bundles.find(b => b.id === selectedId) || bundles[2];

  // The Checkout Logic
  const handleCheckout = () => {
    if (!selectedBundle.variantId) {
      alert("Shopify Variant ID is missing in Sanity!");
      return;
    }

    setIsLoading(true);

    // Construct Shopify Cart Permalink
    // Format: https://{shop}.myshopify.com/cart/{variant_id}:{quantity}
    const checkoutUrl = `https://${shopName}/cart/${selectedBundle.variantId}:1`;

    // Redirect to Shopify
    window.location.href = checkoutUrl;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Bundle Selection Grid */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold uppercase tracking-wider text-primary/60">Select Supply</p>
        <div className="grid grid-cols-1 gap-3">
          {bundles.map((bundle) => {
            const isSelected = selectedId === bundle.id;
            
            return (
              <button
                key={bundle.id}
                onClick={() => setSelectedId(bundle.id)}
                className={clsx(
                  "relative flex items-center p-4 border rounded-xl text-left transition-all duration-200 group",
                  isSelected 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-slate-200 hover:border-primary/50 bg-white"
                )}
              >
                {bundle.bestValue && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Best Value
                  </span>
                )}
                
                <div className={clsx(
                  "size-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors shrink-0",
                  isSelected ? "border-primary bg-primary" : "border-slate-300"
                )}>
                  {isSelected && <div className="size-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className={clsx("font-bold text-lg", isSelected ? "text-primary" : "text-slate-700")}>
                      {bundle.title}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${bundle.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 flex justify-between w-full">
                    <span>{bundle.subtitle}</span>
                    {bundle.discount > 0 && (
                      <span className="text-primary font-bold bg-primary/10 px-1.5 rounded text-xs flex items-center">
                        Save {bundle.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-[#002a55] text-white font-bold text-lg h-14 rounded-lg shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Proceed to Checkout</span>
              <span className="font-normal opacity-80">- ${selectedBundle.price.toFixed(2)}</span>
              <ShoppingBag className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
        
        {/* Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Lab Tested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Leaf className="w-4 h-4" />
            <span>Carbon Neutral</span>
          </div>
        </div>
      </div>
    </div>
  );
}