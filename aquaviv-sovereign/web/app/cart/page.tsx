'use client';

import { useCart } from '@/components/providers/CartContext';
import { FadeIn } from '@/components/ui/FadeIn';
import { Trash2, ArrowRight, Lock, ShoppingBag } from 'lucide-react'; // Added ShoppingBag import
import Link from 'next/link';

export default function CartPage() {
  const { cart, isLoading, removeItem } = useCart(); // Destructure removeItem

  // Helper: Format Price
  const formatPrice = (amount: string, currency: string) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));

  // Loading State
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty State
  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center p-4">
        <FadeIn className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
          <p className="text-slate-500 mb-8">Begin your path to cellular hydration by selecting your protocol.</p>
          <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-slate-800 transition-all">
            Browse The Collection
          </Link>
        </FadeIn>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface-light pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">Your Active Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cart.lines.edges.map(({ node }: any) => (
              <FadeIn key={node.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-6 items-center">
                
                {/* Product Image */}
                <div className="w-24 h-24 bg-slate-50 rounded-xl relative overflow-hidden shrink-0 flex items-center justify-center">
                   {node.merchandise.image && (
                     <img 
                       src={node.merchandise.image.url} 
                       alt={node.merchandise.image.altText || node.merchandise.product.title} 
                       className="w-full h-full object-contain p-2"
                     />
                   )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{node.merchandise.product.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{node.merchandise.title === 'Default Title' ? 'One Size' : node.merchandise.title}</p>
                  
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-slate-900">
                      {formatPrice(node.cost.totalAmount.amount, node.cost.totalAmount.currencyCode)}
                    </p>
                    
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-1 border border-slate-100">
                       <span className="text-xs font-bold text-slate-500">Qty: {node.quantity}</span>
                    </div>

                    {/* DELETE BUTTON */}
                    <button 
                      onClick={() => removeItem(node.id)}
                      disabled={isLoading}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </FadeIn>
            ))}
          </div>

          {/* RIGHT: Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-32">
              <h3 className="font-bold text-xl mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">
                    {formatPrice(cart.cost?.subtotalAmount?.amount || '0', cart.cost?.subtotalAmount?.currencyCode || 'USD')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">Calculated at Checkout</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full mb-8" />

              {/* Checkout Button */}
              <a 
                href={cart.checkoutUrl} 
                className="w-full py-4 bg-accent hover:bg-cyan-400 text-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/20 mb-4"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Lock className="w-3 h-3" />
                <span>Encrypted by Shopify Secure</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}