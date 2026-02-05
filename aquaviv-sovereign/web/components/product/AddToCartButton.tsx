'use client';

import { useCart } from '@/components/providers/CartContext';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function AddToCartButton({ variantId, available }: { variantId: string, available: boolean }) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // HELPER: Force the ID into the correct format right here
  const cleanId = (id: string) => {
    if (!id) return '';
    if (id.startsWith('gid://')) return id;
    return `gid://shopify/ProductVariant/${id}`;
  }

  const handleAdd = async () => {
    if (!variantId) return;
    setIsAdding(true);
    
    // Use the cleaned ID
    await addToCart(cleanId(variantId), 1);
    
    setIsAdding(false);
  };

  if (!available) {
    return (
      <button disabled className="w-full py-4 bg-slate-200 text-slate-400 font-bold rounded-full cursor-not-allowed">
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding || isLoading}
      className="w-full py-4 bg-accent hover:bg-white text-primary hover:scale-[1.02] transition-all font-bold rounded-full shadow-[0_0_20px_rgba(0,180,216,0.3)] flex items-center justify-center gap-2"
    >
      {isAdding ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}