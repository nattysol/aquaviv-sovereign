import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { FadeIn } from '@/components/ui/FadeIn';
import { ProductUI } from '@/components/product/ProductUI'; // <--- Import the Client Island
import { Activity, Globe, Beaker, Leaf } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. FETCH DATA (Server Side - Secure & No CORS issues)
  const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0] {
    title, tagline, description, price, mainImage, body
  }`, { slug });

  if (!product) return notFound();

  // 2. EMERGENCY VARIANT ID (Bypass)
  const variantId = "gid://shopify/ProductVariant/42958057930818"; 

  return (
    <main className="min-h-screen bg-surface-light pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: IMAGE (Server Rendered for speed) */}
          <div className="lg:col-span-5 sticky top-24">
            <FadeIn delay={0.1} className="aspect-[4/5] bg-white rounded-3xl border border-slate-100 p-8 flex items-center justify-center relative overflow-hidden group shadow-xl shadow-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent opacity-50" />
              {product.mainImage && (
                <img 
                  src={urlFor(product.mainImage).width(800).url()} 
                  alt={product.title}
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {/* Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-slate-900">High Potency</span>
              </div>
            </FadeIn>

            {/* Trust Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <TrustBadge icon={<Globe size={18} />} label="US Sourced" />
              <TrustBadge icon={<Beaker size={18} />} label="Lab Tested" />
              <TrustBadge icon={<Leaf size={18} />} label="100% Natural" />
            </div>
          </div>

          {/* RIGHT: INTERACTIVE UI (Client Island) */}
          <div className="lg:col-span-7 pt-4">
            <FadeIn delay={0.2}>
              <ProductUI product={product} variantId={variantId} />
            </FadeIn>
          </div>

        </div>
      </div>
    </main>
  );
}

function TrustBadge({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-accent hover:border-accent/30 transition-colors">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  )
}