import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { FadeIn } from '@/components/ui/FadeIn';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { Star, ShieldCheck, Zap, Droplets, ChevronDown, FlaskConical, Leaf, Clock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. ADVANCED QUERY: Fetches Product + Related Items
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  tagline,
  description,
  price,
  mainImage,
  body, 
  
  // Shopify Sync Data
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
  },

  // "Complete the Stack" (Fetch 3 other products)
  "related": *[_type == "product" && slug.current != $slug][0..2] {
    title,
    "slug": slug.current,
    price,
    mainImage,
    tagline
  }
}`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await client.fetch(PRODUCT_QUERY, { slug });

  if (!product) return notFound();

  // Extract Variant Data
  const firstVariant = product.store?.variants?.[0]?.store;
  const variantId = firstVariant?.gid;
  const isAvailable = firstVariant?.inventory?.isAvailable ?? true;
  const price = firstVariant?.price || product.price;

  return (
    <main className="min-h-screen bg-surface-light">
      
      {/* SECTION 1: HERO & BUY BOX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: Sticky Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <FadeIn className="bg-white rounded-[3rem] border border-slate-100 p-12 lg:p-20 relative overflow-hidden group shadow-xl shadow-slate-200/40">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
              
              {product.mainImage && (
                <img 
                  src={urlFor(product.mainImage).width(1000).url()} 
                  alt={product.title}
                  className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Float Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur border border-slate-100 px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purity Grade</p>
                    <p className="text-sm font-bold text-slate-900">Clinical / Verified</p>
                 </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT: The Protocol Details */}
          <div className="lg:col-span-5 pt-4">
            <FadeIn delay={0.2}>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Sovereign Series
                  </span>
                  <div className="flex text-amber-400 gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-xs font-bold text-slate-400 ml-1">4.9/5.0</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-none">
                  {product.title}
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="flex items-end gap-6 mb-8 pb-8 border-b border-slate-100">
                <div>
                   <p className="text-xs text-slate-400 font-bold mb-1">PRICE</p>
                   <div className="text-4xl font-bold text-slate-900">${Number(price).toFixed(2)}</div>
                </div>
                <div className="mb-2">
                   {isAvailable ? (
                     <span className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-full">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       In Stock
                     </span>
                   ) : (
                     <span className="text-red-500 font-bold text-sm">Sold Out</span>
                   )}
                </div>
              </div>

              {/* Buy Button */}
              <div className="mb-10">
                {variantId ? (
                   <AddToCartButton variantId={variantId} available={isAvailable} />
                ) : (
                   <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100">Setup Required: Sync Sanity & Shopify</div>
                )}
                <div className="flex justify-center gap-6 mt-4">
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={14} /> Ships within 24h
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck size={14} /> 30-Day Guarantee
                   </div>
                </div>
              </div>

              {/* Information Accordions (Static for now, can be dynamic later) */}
              <div className="space-y-4">
                <AccordionItem title="The Science" icon={<FlaskConical size={18} />}>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Engineered for maximum bioavailability. Unlike generic supplements, our ionic formulation bypasses the digestive bottleneck, allowing for immediate cellular uptake. Verified by 3rd party mass spectrometry.
                  </p>
                </AccordionItem>
                <AccordionItem title="Active Ingredients" icon={<Leaf size={18} />}>
                  <p className="text-slate-500 text-sm leading-relaxed mb-2">
                    <strong>Primary Matrix:</strong> Magnesium, Chloride, Sodium, Potassium.
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    <strong>Trace Elements:</strong> Boron, Lithium, Zinc, and 68+ primordial minerals sourced from the Great Salt Lake.
                  </p>
                </AccordionItem>
                <AccordionItem title="Ritual Protocol" icon={<Zap size={18} />}>
                   <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1">
                      <li><strong>Morning:</strong> 10 drops in 16oz water upon waking.</li>
                      <li><strong>Training:</strong> 10 drops pre-workout for electrolyte stability.</li>
                      <li><strong>Evening:</strong> 5 drops to aid recovery and sleep architecture.</li>
                   </ul>
                </AccordionItem>
              </div>

            </FadeIn>
          </div>
        </div>
      </div>

      {/* SECTION 2: DETAILED DESCRIPTION */}
      <section className="bg-white border-t border-slate-100 py-20">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Clinical Analysis</h2>
            <div className="prose prose-slate prose-lg mx-auto text-slate-600">
              {product.body ? <PortableText value={product.body} /> : <p>{product.description}</p>}
            </div>
         </div>
      </section>

      {/* SECTION 3: COMPLETE THE STACK (Upsell) */}
      {product.related && product.related.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Complete The Ritual</h2>
                <p className="text-slate-500 mt-2">Synergistic compounds to amplify your results.</p>
              </div>
              <Link href="/shop" className="text-primary font-bold hover:underline">View All</Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.related.map((item: any) => (
                <Link key={item.slug} href={`/products/${item.slug}`} className="group block">
                   <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-accent/30 transition-all">
                      <div className="h-48 bg-slate-50 rounded-xl mb-6 relative flex items-center justify-center overflow-hidden">
                         {item.mainImage && (
                            <img src={urlFor(item.mainImage).width(400).url()} className="object-contain h-full p-4 group-hover:scale-110 transition-transform" alt={item.title} />
                         )}
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.tagline}</p>
                      <div className="flex items-center justify-between">
                         <span className="font-bold text-slate-900">${item.price}</span>
                         <span className="text-accent text-sm font-bold group-hover:underline">View Protocol</span>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </section>
      )}

    </main>
  );
}

// Helper: Simple CSS-only Accordion Details
function AccordionItem({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <details className="group border border-slate-200 rounded-xl overflow-hidden bg-white open:border-accent/50 transition-colors">
      <summary className="flex items-center justify-between p-4 cursor-pointer select-none bg-slate-50 group-open:bg-white transition-colors">
        <div className="flex items-center gap-3 font-bold text-slate-700 group-open:text-accent">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="p-4 pt-0 text-slate-600 animate-in slide-in-from-top-2">
        <div className="pt-4 border-t border-slate-100">
           {children}
        </div>
      </div>
    </details>
  );
}