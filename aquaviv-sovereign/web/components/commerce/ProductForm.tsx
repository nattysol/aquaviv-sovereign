'use client';

import { useState } from 'react';
import { useCart } from '@/components/providers/CartContext'; // Using the Brain we built
import { ShoppingBag, Loader2, Check } from 'lucide-react';

interface ProductFormProps {
  basePrice: number;
  shopName: string;
  variantIds: {
    bottle1?: string;
    bottle3?: string;
    bottle6?: string;
  };
}

export function ProductForm({ basePrice, variantIds }: ProductFormProps) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState<1 | 3 | 6>(1);

  // --- EMERGENCY BYPASS ID ---
  // If Sanity sends null, we use this known working ID so you can keep building.
  const WORKING_ID = "gid://shopify/ProductVariant/42958057930818"; 
  // ---------------------------

  const activeVariantId = 
    (quantity === 1 ? variantIds.bottle1 : 
     quantity === 3 ? variantIds.bottle3 : 
     variantIds.bottle6) || WORKING_ID;

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Add the specific variant ID to the cart
    await addToCart(activeVariantId, 1); 
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. QUANTITY SELECTOR (The "Bundle" Logic) */}
      <div className="grid grid-cols-3 gap-3">
        <OptionButton 
          count={1} 
          price={basePrice} 
          active={quantity === 1} 
          onClick={() => setQuantity(1)} 
        />
        <OptionButton 
          count={3} 
          price={basePrice * 3 * 0.9} // Mock 10% discount logic
          active={quantity === 3} 
          onClick={() => setQuantity(3)}
          badge="Save 10%" 
        />
        <OptionButton 
          count={6} 
          price={basePrice * 6 * 0.8} // Mock 20% discount logic
          active={quantity === 6} 
          onClick={() => setQuantity(6)} 
          badge="Best Value"
        />
      </div>

      {/* 2. ADD TO CART BUTTON */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isLoading}
        className="w-full py-4 bg-accent hover:bg-cyan-400 text-primary font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Adding to Ritual...</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Ritual - ${(basePrice * quantity).toFixed(2)}</span>
          </>
        )}
      </button>

      {/* Trust Text */}
      <p className="text-center text-xs text-slate-400">
        30-Day Money Back Guarantee • Free Shipping over $100
      </p>
    </div>
  );
}

// Helper: The selectable box
function OptionButton({ count, price, active, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-3 rounded-xl border-2 transition-all text-center ${
        active 
          ? 'border-accent bg-accent/5 ring-1 ring-accent' 
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
          {badge}
        </span>
      )}
      <div className="font-bold text-slate-900 text-lg">{count} Bottle{count > 1 && 's'}</div>
      <div className="text-sm text-slate-500">${price.toFixed(0)}</div>
      {active && <div className="absolute top-2 right-2 text-accent"><Check size={14} strokeWidth={4} /></div>}
    </button>
  );
}