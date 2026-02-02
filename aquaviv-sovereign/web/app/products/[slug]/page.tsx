import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { ProductForm } from '@/components/commerce/ProductForm';
import { Star, ChevronDown, Droplet, Activity, ShieldCheck, Leaf, FlaskConical, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { PortableText } from 'next-sanity';
import Image from 'next/image';

// 1. DYNAMIC QUERY: Fetches based on the URL 'slug'
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
  shopifyId_1,
  shopifyId_3,
  shopifyId_6
}`;

const SHOP_DOMAIN = 'aquaviv.myshopify.com'; 

export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Fetch data using the slug from the URL
  const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug: params.slug });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface-light text-slate-900 pb-24">
      
      {/* SECTION 1: COMMERCE HERO */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
          
          {/* Left: Gallery (Sticky) */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-24 h-fit">
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
                {/* CPG Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                  Clinical Grade
                </div>
              </div>
            </FadeIn>
            
            {/* Trust Badges (Mobile/Tablet view) */}
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
                {/* Social Proof Header */}
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
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    In Stock & Ready to Ship
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <ProductForm 
                basePrice={product.price}
                shopName={SHOP_DOMAIN} 
                variantIds={{
                  bottle1: product.shopifyId_1,
                  bottle3: product.shopifyId_3,
                  bottle6: product.shopifyId_6
                }}
              />
            </FadeIn>

            {/* Accordions: The Information Architecture */}
            <FadeIn delay={0.3}>
              <div className="border-t border-slate-100 mt-4 space-y-0">
                
                {/* 1. Benefits */}
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
                    </ul>
                  </div>
                </details>

                {/* 2. Ingredients (Transparency) */}
                <details className="group border-b border-slate-100">
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-accent" />
                      Ingredients & Sourcing
                    </span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed pl-8">
                    <p>{product.ingredients || "100% Concentrated Ionic Sea Minerals from Utah's Great Inland Sea."}</p>
                    <div className="mt-4 flex gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span className="border border-slate-200 px-2 py-1 rounded">Non-GMO</span>
                      <span className="border border-slate-200 px-2 py-1 rounded">Vegan</span>
                      <span className="border border-slate-200 px-2 py-1 rounded">GF</span>
                    </div>
                  </div>
                </details>

                {/* 3. The Ritual (Usage) */}
                <details className="group border-b border-slate-100">
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span className="flex items-center gap-3">
                      <Droplet className="w-5 h-5 text-accent" />
                      Daily Ritual
                    </span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed pl-8">
                     <p>{product.ritual}</p>
                     <div className="mt-4 bg-amber-50 text-amber-900 px-4 py-3 rounded-lg text-sm flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>Pro Tip: These minerals are potent. We recommend mixing with lemon water or juice to mask the natural flavor.</p>
                     </div>
                  </div>
                </details>

              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEEP DIVE / FAQs */}
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