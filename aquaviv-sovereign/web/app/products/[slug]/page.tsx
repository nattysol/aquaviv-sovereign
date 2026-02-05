import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { ProductOptionSelector } from '@/components/product/ProductOptionSelector'; // <--- NEW COMPONENT
import { Star, ChevronDown, Droplet, Activity, ShieldCheck, Leaf, FlaskConical, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { PortableText } from '@portabletext/react';

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
  
  // 1. MANUAL OVERRIDES (Legacy Support)
  shopifyId_1,
  shopifyId_3,
  shopifyId_6,

  // 2. AUTOMATIC SYNC (Modern)
  store {
    gid, 
    price,
    inventory { isAvailable },
    // If you linked the PARENT product, this array will be populated
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

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });

  if (!product) return <div>Product Not Found</div>;

  // --- BUILD THE VARIANT OPTIONS LIST ---
  let variants = [];

  // A. Try Automatic Sync (If linked to Parent Product)
  if (product.store?.variants?.length > 0) {
    variants = product.store.variants.map((v: any) => ({
      id: v.store.gid,
      title: v.store.title,
      price: v.store.price,
      label: v.store.title.includes('3') ? 'Popular' : 'Standard',
      savings: v.store.title.includes('3') ? 'Save 15%' : v.store.title.includes('6') ? 'Save 25%' : null
    }));
  } 
  // B. Try Manual IDs (Legacy / Fallback)
  else if (product.shopifyId_1) {
    variants.push({ id: product.shopifyId_1, title: '1 Bottle', price: product.price, label: 'Starter' });
    if (product.shopifyId_3) variants.push({ id: product.shopifyId_3, title: '3 Bottles', price: product.price * 3 * 0.85, label: 'Most Popular', savings: 'Save 15%' });
    if (product.shopifyId_6) variants.push({ id: product.shopifyId_6, title: '6 Bottles', price: product.price * 6 * 0.75, label: 'Best Value', savings: 'Save 25%' });
  }
  // C. Fallback to Single Variant (What you likely have now)
  else if (product.store?.gid || product.store?.variantID) {
    variants.push({
      id: product.store?.gid || product.store?.variantID,
      title: '1 Bottle',
      price: product.store?.price || product.price,
      label: 'Standard'
    });
  }

  // Fallback prices if manual manual IDs didn't have specific prices attached
  // (In a real app, you'd fetch these specific prices from Shopify)

  return (
    <main className="min-h-screen bg-surface-light text-slate-900 pb-24 pt-20">
      
      {/* ... HERO SECTION (Same as before) ... */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-32 h-fit">
             <FadeIn>
               {product.mainImage && (
                  <div className="w-full aspect-[4/5] bg-white rounded-2xl border border-slate-200 overflow-hidden p-8">
                     <img src={urlFor(product.mainImage).width(1000).url()} alt={product.title} className="w-full h-full object-contain" />
                  </div>
               )}
             </FadeIn>
          </div>

          {/* Right: The Engine */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <FadeIn delay={0.1}>
              <div className="space-y-4 border-b border-slate-100 pb-8">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">{product.title}</h1>
                <p className="text-lg text-slate-500">{product.tagline}</p>
              </div>
            </FadeIn>

            {/* THE NEW SELECTOR */}
            <FadeIn delay={0.2}>
               <ProductOptionSelector variants={variants} />
            </FadeIn>

            {/* ... Rest of Accordions/Details ... */}
             <div className="border-t border-slate-100 mt-4 space-y-0">
                <details className="group border-b border-slate-100" open>
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary">
                    <span className="flex items-center gap-3"><Activity className="w-5 h-5 text-accent" /> Benefits</span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 pl-8">
                    <ul className="space-y-2">
                       {product.benefits?.map((b: string, i: number) => <li key={i}>• {b}</li>)}
                    </ul>
                  </div>
                </details>
             </div>

          </div>
        </div>
      </div>
      
      {/* ... Rich Text ... */}
      
    </main>
  );
}