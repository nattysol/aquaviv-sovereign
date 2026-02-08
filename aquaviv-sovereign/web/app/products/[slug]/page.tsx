import { client } from '@/sanity/lib/client';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductOptionSelector } from '@/components/product/ProductOptionSelector';
import { KlaviyoTracker } from '@/components/KlaviyoTracker'; // Tracks "Viewed Product"
import { RichText } from '@/components/ui/RichText'; // Beautiful Typography
import { Star, ChevronDown, Droplet, Activity, ShieldCheck, Leaf, FlaskConical, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { Metadata } from 'next'; // Import Metadata type

// 1. THE MASTER QUERY
const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  title,
  tagline,
  price,
  
  // Media
  mainImage,
  gallery,
  "videoUrl": video.asset->url,

  // Content
  benefits,
  ritual,
  proTip,
  ingredients,
  longDescription,
  faqs,

  // Commerce Data (Legacy/Manual)
  shopifyId_1,
  shopifyId_3,
  shopifyId_6,
  
  // Commerce Data (Manual Price Overrides)
  price_3_pack,
  price_6_pack,

  // Commerce Data (Automatic Sync)
  store {
    gid, 
    price,
    inventory { isAvailable },
    variants[]-> {
      store {
        gid,
        title,
        price,
        inventory { isAvailable }
      }
    }
  }
}`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. ADD THIS FUNCTION
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Quick fetch just for SEO (Lightweight)
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ 
      title, 
      tagline, 
      "imageUrl": mainImage.asset->url 
    }`, 
    { slug }
  );

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | aquaViv Minerals`,
    description: product.tagline || 'Clinical grade cellular hydration.',
    openGraph: {
      title: product.title,
      description: product.tagline,
      images: [product.imageUrl || '/images/og-default.jpg'], // Fallback image
    },
  };
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

  // --- LOGIC: BUILD VARIANT OPTIONS ---
  // This handles the "Math" to match Shopify prices ($89.95 / $174.95)
  let variants = [];
  
  // A. Automatic Sync (If linked to Parent Product)
  if (product.store?.variants?.length > 0) {
    variants = product.store.variants.map((v: any) => ({
      id: v.store.gid,
      title: v.store.title,
      price: v.store.price,
      label: v.store.title.includes('3') ? 'Popular' : 'Standard',
      savings: v.store.title.includes('3') ? 'Save 33%' : v.store.title.includes('6') ? 'Save 35%' : null
    }));
  } 
  // B. Manual IDs (The Fallback Engine)
  else if (product.shopifyId_1) {
    // 1 Bottle
    variants.push({ 
      id: product.shopifyId_1, 
      title: '1 Bottle', 
      price: product.price, 
      label: 'Starter' 
    });

    // 3 Bottles
    if (product.shopifyId_3) {
      // Priority: Use explicit "price_3_pack" from Sanity. 
      // Fallback: Calculate 33% off (approx $89.95)
      const price3 = product.price_3_pack || (product.price * 3 * 0.67);
      
      variants.push({ 
        id: product.shopifyId_3, 
        title: '3 Bottles', 
        price: price3, 
        label: 'Most Popular', 
        savings: 'Save 33%' 
      });
    }

    // 6 Bottles
    if (product.shopifyId_6) {
      // Priority: Use explicit "price_6_pack" from Sanity.
      // Fallback: Calculate 35% off (approx $174.95)
      const price6 = product.price_6_pack || (product.price * 6 * 0.65);

      variants.push({ 
        id: product.shopifyId_6, 
        title: '6 Bottles', 
        price: price6, 
        label: 'Best Value', 
        savings: 'Save 35%' 
      });
    }
  }
  // C. Single Item Fallback
  else if (product.store?.gid || product.store?.variantID) {
    variants.push({
      id: product.store?.gid || product.store?.variantID,
      title: '1 Bottle',
      price: product.store?.price || product.price,
      label: 'Standard'
    });
  }

  return (
    // ADDED: pt-24 lg:pt-28 (This pushes the content below the navbar)
  <main className="min-h-screen bg-surface-light text-slate-900 pb-24 pt-16 lg:pt-28">
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.tagline,
      image: product.mainImage?.asset?.url,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.store?.inventory?.isAvailable 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
      },
    }),
  }}
/>
      {/* 1. KLAVIYO TRACKING (Invisible) */}
      <KlaviyoTracker product={product} />

      {/* 2. HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
          
          {/* Left: Gallery (Video + Images) */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-32 h-fit">
            
            <ProductGallery 
              mainImage={product.mainImage} 
              gallery={product.gallery} 
              video={product.videoUrl} 
            />
            
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
              </div>
            </FadeIn>

            {/* SELECTOR & ADD TO CART */}
            <FadeIn delay={0.2}>
               {variants.length > 0 ? (
                 <ProductOptionSelector variants={variants} />
               ) : (
                 <div className="bg-red-50 p-4 text-red-600 rounded">
                   Sync Error: No Variants Found. Please check Sanity Connection.
                 </div>
               )}
            </FadeIn>

            {/* --- ACCORDIONS (CONTENT SECTION) --- */}
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
                    {product.benefits && product.benefits.length > 0 ? (
                      <ul className="space-y-3">
                        {product.benefits.map((benefit: string, i: number) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-accent mt-1.5 text-[10px]">●</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Supports cellular hydration, energy, and cognitive function.</p>
                    )}
                  </div>
                </details>

                {/* 2. Ingredients */}
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

                {/* 3. Ritual */}
                <details className="group border-b border-slate-100">
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span className="flex items-center gap-3">
                      <Droplet className="w-5 h-5 text-accent" />
                      Daily Ritual
                    </span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed pl-8">
                     <p>{product.ritual || "Take 1ml daily in water or juice."}</p>
                     
                     {/* DYNAMIC PRO TIP */}
                     {product.proTip && (
                       <div className="mt-4 bg-amber-50 text-amber-900 px-4 py-3 rounded-lg text-sm flex gap-3 items-start border border-amber-100/50">
                          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-800 block mb-1">Pro Tip</span>
                            {product.proTip}
                          </div>
                       </div>
                     )}
                  </div>
                </details>

              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* 3. THE DEEP DIVE (Formatted Rich Text) */}
      {product.longDescription && (
        <section className="bg-white border-t border-slate-100 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12">
                 <h2 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">The Science</h2>
                 <p className="text-3xl font-bold text-slate-900">Deep Dive into the Source</p>
              </div>
              
              <RichText content={product.longDescription} />
              
            </FadeIn>
          </div>
        </section>
      )}

      {/* 4. FAQs */}
      {product.faqs && product.faqs.length > 0 && (
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
             <div className="pt-6 border-t border-slate-100">
      <p className="text-xs text-slate-400 italic leading-relaxed">
        *FDA Disclaimer: The efficacy of these products has not been confirmed by FDA-approved research. 
        This product is not intended to diagnose, treat, cure or prevent any disease. 
        All information presented here is not meant as a substitute for or alternative to information from health care practitioners.
      </p>
   </div>
             </FadeIn>
          </div>
        </section>
      )}
      {/* --- NEW: IN-LINE DISCLAIMER --- */}
   

    </main>
  );
}