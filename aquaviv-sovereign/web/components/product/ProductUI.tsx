'use client';

import { useState } from 'react';
import { Star, ShieldCheck, Zap, Droplets, ChevronDown, Leaf, Globe, Activity, Beaker } from 'lucide-react';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { PortableText } from '@portabletext/react';

// Mock Data for the rich sections
const INGREDIENTS = [
  { name: "Magnesium Chloride", role: "Cellular Energy", source: "Zechstein Seabed" },
  { name: "Potassium", role: "Hydration", source: "Deep Sea Brine" },
  { name: "Selenium", role: "Immunity", source: "Volcanic Ash" },
];

const FAQS = [
  { q: "How do I take this?", a: "Add 10 drops to 32oz of water daily. It remineralizes RO/filtered water instantly." },
  { q: "Is this safe for children?", a: "Yes, in reduced dosages. We recommend 1 drop per year of age." },
  { q: "Where is it sourced?", a: "Harvested from the pristine waters of the Great Salt Lake, solar concentrated for 2 years." },
];

export function ProductUI({ product, variantId }: { product: any, variantId: string }) {
  const [activeTab, setActiveTab] = useState<string | null>('ingredients');
  const [supply, setSupply] = useState<'30' | '90'>('30');

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
         <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">{product.title}</h1>
         <p className="text-xl text-slate-500 font-medium leading-relaxed">{product.tagline}</p>
      </div>

      {/* Price & Rating */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200">
        <div>
           <span className="text-4xl font-bold text-slate-900">${product.price}</span>
           <span className="text-slate-400 text-sm ml-2">/ bottle</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex text-amber-400 gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <span className="text-xs font-bold text-slate-400 mt-1">4.9/5 (128 Reviews)</span>
        </div>
      </div>

      {/* QUANTITY SELECTOR */}
      <div className="mb-8">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Select Supply</label>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setSupply('30')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${supply === '30' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <span className="block font-bold text-slate-900">30 Day Supply</span>
            <span className="text-xs text-slate-500">Standard Protocol</span>
          </button>
          <button 
            onClick={() => setSupply('90')}
            className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${supply === '90' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">SAVE 20%</div>
            <span className="block font-bold text-slate-900">90 Day Supply</span>
            <span className="text-xs text-slate-500">Commit to Hydration Goals</span>
          </button>
        </div>
      </div>

      {/* ADD TO CART */}
      <div className="mb-12">
        <AddToCartButton variantId={variantId} available={true} />
        <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
          <ShieldCheck size={14} /> 
          <span>Lifetime Guarantee on your first order.</span>
        </p>
      </div>

      {/* RICH ACCORDIONS */}
      <div className="space-y-4 mb-12">
        
        {/* Ingredients */}
        <AccordionItem 
          title="Trace Minerals" 
          isOpen={activeTab === 'ingredients'} 
          onClick={() => setActiveTab(activeTab === 'ingredients' ? null : 'ingredients')}
        >
          <div className="space-y-3">
            {INGREDIENTS.map((ing) => (
              <div key={ing.name} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="font-bold text-slate-700">{ing.name}</span>
                <div className="text-right">
                  <span className="block text-xs text-slate-500">{ing.role}</span>
                  <span className="block text-[10px] text-emerald-600 font-bold">{ing.source}</span>
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Sourcing */}
        <AccordionItem 
          title="Origin & Sourcing" 
          isOpen={activeTab === 'sourcing'} 
          onClick={() => setActiveTab(activeTab === 'sourcing' ? null : 'sourcing')}
        >
          <p className="text-slate-600 leading-relaxed text-sm">
            Bamboo salt minerals harvested from the Korean Coast...
          </p>
        </AccordionItem>

        {/* FAQ */}
        <AccordionItem 
          title="Common Questions" 
          isOpen={activeTab === 'faq'} 
          onClick={() => setActiveTab(activeTab === 'faq' ? null : 'faq')}
        >
          <div className="space-y-4">
            {FAQS.map((item, i) => (
              <div key={i}>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.q}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </AccordionItem>

      </div>

      {/* DESCRIPTION (Rich Text) */}
       <div className="prose prose-slate prose-lg text-slate-600">
          {product.body ? <PortableText value={product.body} /> : <p>{product.description}</p>}
       </div>

    </div>
  );
}

// Sub-component for Accordion
function AccordionItem({ title, isOpen, onClick, children }: any) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
          <div className="pt-4 animate-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}