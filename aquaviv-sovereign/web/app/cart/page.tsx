'use client';

import { useCart } from '@/components/providers/CartContext';
import { FadeIn } from '@/components/ui/FadeIn';
import { ShoppingBag, ArrowRight, Trash2, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, isLoading } = useCart();

  // 1. Loading State
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading Ritual...</div>
      </div>
    );
  }

  // 2. Empty State
  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="min-h-screen bg-surface-light flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Vessel is Empty</h1>
        <p className="text-slate-500 mb-8">Begin your protocol to initiate sovereignty.</p>
        <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-accent transition-colors">
          Browse The Collection
        </Link>
      </div>
    );
  }

  // 3. Populate Cart
  const subtotal = cart.estimatedCost?.subtotalAmount?.amount || 0;
  const currency = cart.estimatedCost?.subtotalAmount?.currencyCode || 'USD';
  const checkoutUrl = cart.checkoutUrl;

  return (
    <main className="min-h-screen bg-surface-light pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">Your Ritual</h1>
          <p className="text-slate-500 mt-2">Review your selection before initiation.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {cart.lines.edges.map((edge: any) => {
              const item = edge.node;
              return (
                <FadeIn key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl relative overflow-hidden flex-shrink-0">
                    {item.merchandise.image && (
                      <img 
                        src={item.merchandise.image.url} 
                        alt={item.merchandise.product.title} 
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">{item.merchandise.product.title}</h3>
                    <p className="text-xs text-slate-500">{item.merchandise.title}</p>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      ${parseFloat(item.estimatedCost?.totalAmount?.amount || '0').toFixed(2)}
                    </p>
                    {/* Placeholder for Remove functionality */}
                    <button className="text-xs text-red-400 hover:text-red-600 mt-2 flex items-center justify-end gap-1">
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* RIGHT: Summary & Checkout */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-32">
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>
              
              <div className="space-y-3 text-sm mb-6 border-b border-slate-100 pb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">${parseFloat(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Calculated at Checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-lg text-slate-900">Total</span>
                <span className="font-black text-2xl text-slate-900">
                  ${parseFloat(subtotal).toFixed(2)} <span className="text-xs font-normal text-slate-400">{currency}</span>
                </span>
              </div>

              <a 
                href={checkoutUrl} 
                className="w-full bg-accent hover:bg-black text-primary hover:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Lock size={18} />
                Secure Checkout
              </a>

              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Encrypted by Shopify Secure
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}