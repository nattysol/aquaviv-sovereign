import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { ArrowRight, Star } from 'lucide-react';

// 1. Fetch ALL products
const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(price asc) {
  title,
  slug,
  tagline,
  price,
  mainImage
}`;

export default async function ShopPage() {
  const products = await client.fetch(ALL_PRODUCTS_QUERY);

  return (
    <main className="min-h-screen bg-surface-light">
      
      {/* 1. SHOP HERO */}
      <section className="bg-surface-dark text-white pt-32 pb-20 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">
              The Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cellular Hydration
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Targeted protocols for energy, clarity, and cellular restoration. 
              Each formula is engineered for maximum bioavailability.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. PRODUCT GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {products.map((product: any, i: number) => (
            <FadeIn key={product.slug.current} delay={i * 0.1}>
              <Link href={`/products/${product.slug.current}`} className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-accent/30 transition-all duration-500 h-full flex flex-col">
                  
                  {/* Image Area */}
                  <div className="h-[350px] bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
                    {product.mainImage && (
                      <img 
                        src={urlFor(product.mainImage).width(600).url()} 
                        alt={product.title}
                        className="w-full h-full object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Hover Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      View Products
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                         {product.title}
                       </h3>
                       <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-1 rounded">
                         <Star className="w-3 h-3 fill-current" /> 4.9
                       </div>
                    </div>
                    
                    <p className="text-slate-500 text-sm mb-6 flex-1">
                      {product.tagline}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                      <span className="text-lg font-bold text-slate-900">
                        ${product.price?.toFixed(2)}
                      </span>
                      <span className="text-primary text-sm font-bold flex items-center group-hover:gap-2 transition-all">
                        Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            </FadeIn>
          ))}

        </div>
      </section>

    </main>
  );
}