'use client';

import { useCart } from '@/components/providers/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, checkoutUrl } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  // Handle smooth open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const lines = cart?.lines?.edges || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount || '0.00';
  const currency = cart?.cost?.subtotalAmount?.currencyCode || 'USD';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      
      {/* 1. BACKDROP (Dark Overlay) */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />

      {/* 2. DRAWER PANEL */}
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-surface-light">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Your Ritual</h2>
            <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">
              {cart?.totalQuantity || 0} items
            </span>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY (Scrollable Items) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <ShoppingBag className="w-16 h-16 text-slate-200" />
              <p className="text-lg font-medium text-slate-900">Your cart is empty</p>
              <button 
                onClick={closeCart}
                className="text-accent font-bold hover:underline"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            lines.map(({ node }: any) => (
              <div key={node.id} className="flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-24 bg-slate-50 rounded-lg border border-slate-100 flex-shrink-0 overflow-hidden">
                  {node.merchandise.image && (
                    <img 
                      src={node.merchandise.image.url} 
                      alt={node.merchandise.product.title}
                      className="w-full h-full object-contain p-2"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {node.merchandise.product.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {node.merchandise.title !== 'Default Title' ? node.merchandise.title : '30 Day Supply'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(node.id, node.quantity - 1)}
                        className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                        disabled={node.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{node.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(node.id, node.quantity + 1)}
                         className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">
                        ${Number(node.cost.totalAmount.amount).toFixed(0)}
                      </span>
                      <button 
                        onClick={() => removeItem(node.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER (Checkout) */}
        {lines.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-slate-900">${Number(subtotal).toFixed(2)} {currency}</span>
            </div>
            
            <p className="text-xs text-slate-400 mb-6 text-center">
              Shipping & taxes calculated at checkout.
            </p>

            <a 
              href={checkoutUrl} 
              className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
               <Lock className="w-3 h-3" />
               Secure SSL Checkout
            </div>
          </div>
        )}

      </div>
    </div>
  );
}