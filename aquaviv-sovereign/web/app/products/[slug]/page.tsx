import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { FadeIn } from '@/components/ui/FadeIn';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { Star, ShieldCheck, Zap, Droplets } from 'lucide-react';
import { notFound } from 'next/navigation';

// 1. THE QUERY
// Updated to look for your manual "variantGid" field first
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  tagline,
  description,
  price,
  mainImage,
  body, 
  
  // OPTION A: Manual Entry (What you are using)
  // Check your schema: if the field name is different (e.g. 'shopifyVariantId'), change 'variantGid' below to match.
  variantGid, 

  // OPTION B: Automatic Sync (Backup)
  store {
    variants[]-> {
      store {
        id,
        gid,
        price,
        inventory {
          isAvailable
        }
      }
    }
  }
}`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // 1. Await params (Required for Next.js 15)
  const { slug } = await params;

  // 2. Fetch Data
  const product = await client.fetch(PRODUCT_QUERY, { slug });

  if (!product) {
    return notFound();
  }

  // 3. Extract Variant ID (The connection to Shopify)
  // Logic: Use the manual GID if it exists; otherwise try the synced one.
  const variantId = product.variantGid || product.store?.variants?.[0]?.store?.gid;
  
  // Logic: If using manual GID, assume it's in stock (since we can't check). 
  // If using sync, check the real inventory.
  const isAvailable = product.variantGid 
    ? true 
    : (product.store?.variants?.[0]?.store?.inventory?.isAvailable ?? true);

  // Logic: Use manual price if sync is missing
  const price = product.store?.variants?.[0]?.store?.price || product.price;

  return (
    <main className="min-h-screen bg-surface-light pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: Product Image (Gallery) */}
          <FadeIn delay={0.1} className="relative aspect-square bg-white rounded-3xl border border-slate-100 p-12 flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent opacity-50" />
            
            {product.mainImage && (
              <img 
                src={urlFor(product.mainImage).width(800).url()} 
                alt={product.title}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Floating Badge */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur border border-slate-100 px-4 py-2 rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-600">Clinical Grade Purity</span>
            </div>
          </FadeIn>

          {/* RIGHT: Product Details */}
          <div className="pt-8">
            <FadeIn delay={0.2}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-bold text-slate-400">(128 Reviews)</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {product.title}
              </h1>
              
              <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed max-w-lg">
                {product.tagline}
              </p>

              <div className="h-px bg-slate-200 w-full mb-8" />

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-slate-900">
                  ${Number(price).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-emerald-600 mb-1.5 bg-emerald-50 px-2 py-1 rounded">
                  In Stock & Ready to Ship
                </span>
              </div>

              {/* ACTION: Add To Cart Button */}
              <div className="mb-8">
                {variantId ? (
                   <AddToCartButton variantId={variantId} available={isAvailable} />
                ) : (
                   <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                     <strong>Setup Required:</strong> No Shopify Variant ID found.<br/>
                     Please paste the GID into the &quot;Variant GID&quot; field in Sanity.
                   </div>
                )}
                <p className="text-center text-xs text-slate-400 mt-3">
                  30-Day Money Back Guarantee • Free Shipping over $100
                </p>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                    <Zap className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Bio-Available</h4>
                      <p className="text-xs text-slate-500">Ionic form for instant absorption.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                    <Droplets className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Full Spectrum</h4>
                      <p className="text-xs text-slate-500">72+ trace minerals included.</p>
                    </div>
                 </div>
              </div>

              {/* DESCRIPTION (Portable Text) */}
              <div className="prose prose-slate prose-lg text-slate-600">
                {product.body ? (
                  <PortableText value={product.body} />
                ) : (
                  <p>{product.description}</p>
                )}
              </div>

            </FadeIn>
          </div>

        </div>
      </div>
    </main>
  );
}