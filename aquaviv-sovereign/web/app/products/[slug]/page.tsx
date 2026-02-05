import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { AddToCartButton } from '@/components/product/AddToCartButton'; // <--- We use our working button
import { Star, ChevronDown, Droplet, Activity, ShieldCheck, Leaf, FlaskConical, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { PortableText } from '@portabletext/react';

// 1. DYNAMIC QUERY (Now fetches the synced Shopify ID automatically)
const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  title,
  tagline,
  price,
  benefits,
  ritual,
  ingredients,
  longDescription,
  faqs,
  mainImage,
  
  // FETCH SHOPIFY DATA AUTOMATICALLY
  store {
    variants[]-> {
      store {
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
  const { slug } = await params;
  const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  // Extract the synced ID
  const firstVariant = product.store?.variants?.[0]?.store;
  const variantId = firstVariant?.gid;
  const isAvailable = firstVariant?.inventory?.isAvailable ?? true;
  const price = firstVariant?.price || product.price;

  return (
    <main className="min-h-screen bg-surface-light text-slate-900 pb-24 pt-20">
      
      {/* SECTION 1: COMMERCE HERO */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-32 h-fit">
            <FadeIn>
              <div className="w-full aspect-[4/5] bg-gradient-to-b from-white to-slate-50 rounded-2xl overflow-hidden relative group border border-slate-200 shadow-sm">
                {product.mainImage ? (
                  <img 
                    src={urlFor(product.mainImage).width(1000).url()} 
                    alt={product.title}
                    className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/20 bg-primary/5">
                    <Droplet className="w-32 h-32" />
                  </div>
                )}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                  Clinical Grade
                </div>
              </div>
            </FadeIn>
            
            <div className="flex justify-center gap-6 lg:hidden text-slate-400">
               <ShieldCheck className="w-6 h-6" />
               <Leaf className="w-6 h-6" />
               <FlaskConical className="w-6 h-6" />
            </div>
          </div>

          {/* Right: The Engine */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <FadeIn delay={0.1}>
              <div className="space-y-4 border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-slate-500 text-sm font-medium">4.9/5 (128 Reviews)</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
                  {product.title}
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed">
                  {product.tagline}
                </p>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl font-bold text-slate-900">
                    ${Number(price).toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    In Stock
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* THE ADD TO CART BUTTON */}
            <FadeIn delay={0.2}>
               <div className="py-2">
                  {variantId ? (
                    <AddToCartButton variantId={variantId} available={isAvailable} />
                  ) : (
                    <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-200">
                      <strong>Sync Required:</strong> Please select the Shopify product in Sanity Studio to enable purchasing.
                    </div>
                  )}
                  <p className="text-center text-xs text-slate-400 mt-4">
                    30-Day Guarantee • Free Shipping over $100
                  </p>
               </div>
            </FadeIn>

            {/* Accordions */}
            <FadeIn delay={0.3}>
              <div className="border-t border-slate-100 mt-4 space-y-0">
                
                {/* Benefits */}
                <details className="group border-b border-slate-100" open>
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-accent" />
                      Clinical Benefits
                    </span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed pl-8">
                    <ul className="space-y-3">
                      {product.benefits?.map((benefit: string, i: number) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-accent mt-1.5 text-[10px]">●</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                      {!product.benefits && <li>Supports cellular hydration and energy.</li>}
                    </ul>
                  </div>
                </details>

                {/* Ingredients */}
                <details className="group border-b border-slate-100">
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-accent" />
                      Ingredients & Sourcing
                    </span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed pl-8">
                    <p>{product.ingredients || "100% Concentrated Ionic Sea Minerals."}</p>
                    <div className="mt-4 flex gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span className="border border-slate-200 px-2 py-1 rounded">Non-GMO</span>
                      <span className="border border-slate-200 px-2 py-1 rounded">Vegan</span>
                      <span className="border border-slate-200 px-2 py-1 rounded">GF</span>
                    </div>
                  </div>
                </details>

                {/* Ritual */}
                <details className="group border-b border-slate-100">
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span className="flex items-center gap-3">
                      <Droplet className="w-5 h-5 text-accent" />
                      Daily Ritual
                    </span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed pl-8">
                     <p>{product.ritual || "Take 1ml daily in water."}</p>
                     <div className="mt-4 bg-amber-50 text-amber-900 px-4 py-3 rounded-lg text-sm flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>Pro Tip: Mix with lemon water or juice.</p>
                     </div>
                  </div>
                </details>

              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE DEEP DIVE (Rich Text) */}
      {product.longDescription && (
        <section className="bg-white border-t border-slate-100 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <FadeIn>
              <div className="prose prose-slate prose-lg mx-auto prose-headings:font-bold prose-headings:text-primary prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-primary">
                <PortableText value={product.longDescription} />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* SECTION 3: FAQs */}
      {product.faqs && (
        <section className="bg-white border-t border-slate-100 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4">
             <FadeIn>
               <h2 className="text-3xl font-bold text-center text-primary mb-12">Frequently Asked Questions</h2>
               <div className="space-y-4">
                 {product.faqs.map((faq: any, i: number) => (
                   <details key={i} className="group bg-surface-light rounded-xl overflow-hidden">
                     <summary className="flex justify-between items-center font-bold text-lg p-6 cursor-pointer text-slate-900 hover:text-primary transition-colors list-none">
                       <span>{faq.question}</span>
                       <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
                     </summary>
                     <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                       {faq.answer}
                     </div>
                   </details>
                 ))}
               </div>
             </FadeIn>
          </div>
        </section>
      )}

    </main>
  );
}