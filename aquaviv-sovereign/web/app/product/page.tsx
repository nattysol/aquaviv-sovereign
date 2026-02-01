import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { ProductForm } from '@/components/commerce/ProductForm';
import { Star, ChevronDown, Droplet, Activity, ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn'; // <--- Import

const PRODUCT_QUERY = `*[_type == "product" && slug.current == "aquaviv-mineral-drops"][0] {
  title,
  tagline,
  price,
  benefits,
  ritual,
  mainImage,
  shopifyId_1,
  shopifyId_3,
  shopifyId_6
}`;

// Replace with your actual domain
const SHOP_DOMAIN = 'aquaviv.myshopify.com'; 

export default async function ProductPage() {
  const product = await client.fetch(PRODUCT_QUERY);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p>Please check your Sanity Studio data.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface-light text-slate-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-8 h-fit">
            <FadeIn>
              <div className="w-full aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden relative group border border-slate-200">
                {product.mainImage ? (
                  <img 
                    src={urlFor(product.mainImage).width(800).url()} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/20 bg-primary/5">
                    <Droplet className="w-32 h-32" />
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Header Info */}
            <div className="border-b border-slate-100 pb-8 space-y-4">
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-3">
                  <span className="bg-accent/10 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    Best Seller
                  </span>
                  <span className="text-primary text-sm font-medium flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9/5 Rating
                  </span>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-2">
                    {product.title}
                  </h1>
                  <p className="text-lg text-slate-500">
                    {product.tagline}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-slate-900">
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* The Bundle Engine */}
            <FadeIn delay={0.4}>
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

            {/* Dynamic Accordions */}
            <FadeIn delay={0.5}>
              <div className="border-t border-slate-100 mt-4">
                <details className="group border-b border-slate-100" open>
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span>Clinical Benefits</span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed">
                    <ul className="space-y-3">
                      {product.benefits?.map((benefit: string, i: number) => (
                        <li key={i} className="flex gap-3 items-start">
                          <Activity className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>

                <details className="group border-b border-slate-100">
                  <summary className="flex justify-between items-center font-bold text-lg py-5 cursor-pointer text-primary hover:text-accent transition-colors list-none">
                    <span>The Ritual</span>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-slate-600 leading-relaxed flex gap-4">
                    <div className="bg-primary/5 p-3 rounded-lg h-fit text-primary">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <p>{product.ritual}</p>
                  </div>
                </details>
              </div>
            </FadeIn>

          </div>
        </div>
      </div>
    </main>
  );
}