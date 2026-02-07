'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ChevronRight, Zap, Moon, Sparkles, Droplet, 
  ShoppingCart, Check, FlaskConical, Leaf, Truck, ArrowRight,
  Activity, Flame, Battery
} from 'lucide-react';
import { useCart } from '@/components/providers/CartContext';

// --- CONFIGURATION: Define your Products here ---
const PRODUCTS = {
  ENERGY: {
    id: 'energy',
    title: 'Ionic Minerals: Peak Energy',
    variantId: '42958057930818', // <--- REPLACE WITH REAL ID
    description: 'High-sodium electrolyte complex for immediate vitality and neural firing.',
    tags: ['Electrolyte Balance', 'Peak Energy', 'Pure Source'],
    image: '/images/product-energy.png' // Replace with your image path
  },
  RECOVERY: {
    id: 'recovery',
    title: 'Ionic Minerals: Deep Sleep',
    variantId: '42958057930819', // <--- REPLACE WITH REAL ID
    description: 'Magnesium-rich formula to downregulate the nervous system and repair cells.',
    tags: ['Deep Sleep', 'Muscle Repair', 'Calm Mind'],
    image: '/images/product-sleep.png'
  },
  BALANCE: {
    id: 'balance',
    title: 'Ionic Minerals: Daily Glow',
    variantId: '42958057930820', // <--- REPLACE WITH REAL ID
    description: 'Trace mineral blend for skin hydration, collagen support, and daily focus.',
    tags: ['Skin Health', 'Daily Focus', 'Hydration'],
    image: '/images/product-glow.png'
  }
};

// --- DATA: The Questions ---
const QUESTIONS = [
  {
    id: 1,
    title: "What is your primary wellness focus?",
    subtitle: "Select one to begin your aquaViv journey",
    options: [
      { id: 'energy', label: 'Peak Energy', sub: 'Maximize daily vitality', icon: <Zap size={32} />, weight: 'ENERGY' },
      { id: 'sleep', label: 'Deep Recovery', sub: 'Rest and cellular repair', icon: <Moon size={32} />, weight: 'RECOVERY' },
      { id: 'focus', label: 'Mental Clarity', sub: 'Sharpen cognitive focus', icon: <Sparkles size={32} />, weight: 'BALANCE' },
      { id: 'skin', label: 'Skin & Glow', sub: 'Hydrate from within', icon: <Droplet size={32} />, weight: 'BALANCE' },
    ]
  },
  {
    id: 2,
    title: "How would you describe your activity level?",
    subtitle: "We need to gauge your mineral depletion rate",
    options: [
      { id: 'sedentary', label: 'Flow State', sub: 'Mostly desk work / light walking', icon: <Battery size={32} />, weight: 'BALANCE' },
      { id: 'active', label: 'Active Lifestyle', sub: 'Gym 3-4x per week', icon: <Activity size={32} />, weight: 'ENERGY' },
      { id: 'athlete', label: 'High Performance', sub: 'Intense daily training', icon: <Flame size={32} />, weight: 'RECOVERY' },
    ]
  },
  {
    id: 3,
    title: "Do you experience the 'Afternoon Slump'?",
    subtitle: "That brain fog around 2:00 PM...",
    options: [
      { id: 'often', label: 'Every Day', sub: 'I need caffeine to survive', icon: <Zap size={32} />, weight: 'ENERGY' },
      { id: 'sometimes', label: 'Occasionally', sub: 'Depends on my sleep', icon: <Moon size={32} />, weight: 'RECOVERY' },
      { id: 'rarely', label: 'Rarely', sub: 'I have steady energy', icon: <Sparkles size={32} />, weight: 'BALANCE' },
    ]
  }
];

export default function QuizPage() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]); // Stores 'weight' of selected answers
  const [result, setResult] = useState<any>(null); // The final product object
  const { addToCart, openCart } = useCart();
  const [adding, setAdding] = useState(false);

  // --- LOGIC: Process Answer ---
  const handleAnswer = (weight: string) => {
    const newAnswers = [...answers, weight];
    setAnswers(newAnswers);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      // Go to next question
      setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 300);
    } else {
      // CALCULATE RESULT
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: string[]) => {
    // Count occurrences of each weight (ENERGY, RECOVERY, BALANCE)
    const counts: Record<string, number> = finalAnswers.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    // Find the winner
    const winnerKey = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    // Map to Product Object
    // @ts-ignore
    setResult(PRODUCTS[winnerKey]);
  };

  // --- LOGIC: Add Result to Cart ---
  const handleAddToCart = async () => {
    if (!result) return;
    setAdding(true);
    await addToCart(result.variantId, 1);
    setAdding(false);
    openCart();
  };

  // Current Question Object
  const question = QUESTIONS[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen font-sans bg-[#f6f6f8] dark:bg-[#101622] text-[#0d121b] dark:text-white transition-colors duration-300">
      
      {/* --- PHASE 1: THE QUIZ --- */}
      {!result && (
        <motion.div 
          key="quiz-phase"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="relative min-h-screen flex flex-col"
        >
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1.5 bg-[#cfd7e7] dark:bg-gray-800 z-50">
             <motion.div 
               initial={{ width: 0 }} animate={{ width: `${progress}%` }} 
               className="h-full bg-[#1152d4] dark:bg-[#13ecec] transition-all duration-500 ease-out" 
             />
          </div>

          {/* Header */}
          <header className="flex items-center justify-between px-6 py-8 w-full">
            <Link href="/" className="group flex items-center gap-2 text-[#1152d4] dark:text-[#13ecec] font-semibold hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} />
              <span className="hidden md:inline">Back</span>
            </Link>
            <div className="flex flex-col items-end">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1152d4]/60 dark:text-[#13ecec]/60">Step {currentQuestionIdx + 1}</p>
              <p className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Personalization Quiz</p>
            </div>
          </header>

          {/* Question Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full pb-20">
            <AnimatePresence mode='wait'>
              <motion.div 
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl flex flex-col items-center"
              >
                <div className="text-center mb-12">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    {question.title}
                  </h1>
                  <p className="text-[#4c669a] dark:text-gray-400 text-lg">{question.subtitle}</p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {question.options.map((option: any) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.weight)}
                      className="relative p-8 rounded-xl border transition-all duration-300 flex items-center gap-6 text-left bg-white/40 dark:bg-white/5 border-white/50 dark:border-white/10 hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-white/10 group"
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 bg-[#1152d4]/10 dark:bg-[#13ecec]/20 text-[#1152d4] dark:text-[#13ecec] group-hover:bg-[#1152d4] dark:group-hover:bg-[#13ecec] group-hover:text-white dark:group-hover:text-[#101622]">
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{option.label}</h3>
                        <p className="text-sm text-[#4c669a] dark:text-gray-400">{option.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </motion.div>
      )}


      {/* --- PHASE 2: RESULTS --- */}
      {result && (
        <motion.div 
          key="result-phase"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex flex-col"
        >
          {/* Result Header */}
          <header className="w-full px-6 lg:px-20 py-6 flex items-center justify-between border-b border-[#e7f3f3] dark:border-[#1e3a3a] bg-white/50 dark:bg-[#102222]/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
               <div className="text-[#13ecec] size-8 font-black tracking-widest flex items-center">AV</div>
               <h1 className="text-xl font-extrabold tracking-tight">aquaViv</h1>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={openCart} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                 <ShoppingCart size={24} />
               </button>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto px-6 py-12 lg:py-20">
            {/* Header Text */}
            <div className="w-full text-center mb-12 lg:mb-16">
               <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13ecec]/10 text-[#13ecec] dark:text-[#13ecec] text-xs font-bold uppercase tracking-widest mb-4">
                  <Check size={14} /> Analysis Complete
               </span>
               <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Your Custom Protocol <br className="hidden lg:block"/> is Ready.
               </h2>
            </div>

            {/* The Product Card */}
            <div className="w-full grid lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl bg-white dark:bg-[#152e2e] shadow-2xl border border-white dark:border-[#1e3a3a]">
               
               {/* Left: Product Viz */}
               <div className="relative min-h-[400px] lg:min-h-[600px] bg-gradient-to-br from-[#13ecec]/10 to-transparent flex items-center justify-center p-12 overflow-hidden">
                  <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#13ecec] blur-3xl opacity-20" />
                  <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#13ecec] blur-[100px] opacity-20" />
                  
                  {/* Dynamic Image */}
                  <div className="relative z-10 w-full max-w-md aspect-[4/5] bg-contain bg-center bg-no-repeat transition-transform hover:scale-105 duration-700">
                     <div className="w-full h-full bg-[#102222]/5 dark:bg-black/20 rounded-2xl flex items-center justify-center overflow-hidden">
                        {/* If you have images, use <Image /> here. For now, text placeholder. */}
                        <span className="text-[#13ecec] font-bold text-2xl tracking-widest uppercase opacity-30">{result.title}</span>
                     </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl flex items-center justify-between border border-white/20">
                     <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#13ecec] mb-1">Recommended Formula</p>
                        <h3 className="text-xl font-bold">{result.title}</h3>
                     </div>
                     <div className="flex items-center gap-1 text-[#13ecec]">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-sm font-bold">100% Match</span>
                     </div>
                  </div>
               </div>

               {/* Right: Content */}
               <div className="p-8 lg:p-16 flex flex-col justify-center">
                  <div className="max-w-md">
                     <h3 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
                        The Protocol of You
                        <span className="h-px flex-1 bg-gradient-to-r from-[#13ecec]/40 to-transparent" />
                     </h3>
                     <p className="text-[#4c9a9a] dark:text-gray-300 text-lg leading-relaxed mb-8">
                        {result.description}
                     </p>

                     {/* Dynamic Tags */}
                     <div className="flex flex-wrap gap-3 mb-12">
                        {result.tags.map((tag: string) => (
                          <div key={tag} className="flex items-center gap-2 rounded-full bg-[#e7f3f3] dark:bg-[#1e3a3a] px-4 py-2 border border-[#d1eaea] dark:border-[#2a4d4d]">
                             <Check size={14} className="text-[#13ecec]" />
                             <p className="text-sm font-bold">{tag}</p>
                          </div>
                        ))}
                     </div>

                     {/* CTA */}
                     <div className="space-y-6">
                        <button 
                          onClick={handleAddToCart}
                          disabled={adding}
                          className="w-full bg-[#13ecec] text-[#0d1b1b] h-16 rounded-xl font-black text-lg tracking-wide shadow-xl shadow-[#13ecec]/30 hover:shadow-[#13ecec]/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                           {adding ? 'Adding...' : 'Add Protocol to Cart'}
                           {!adding && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        <div className="flex flex-col items-center gap-4">
                           <button onClick={() => { setResult(null); setCurrentQuestionIdx(0); setAnswers([]); }} className="text-[#0d1b1b] dark:text-white text-sm font-bold underline underline-offset-4 decoration-[#13ecec] decoration-2 hover:text-[#13ecec] transition-colors">
                              Retake Quiz
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-20 w-full grid md:grid-cols-3 gap-8">
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="p-3 rounded-lg bg-[#13ecec]/20 text-[#13ecec]"><FlaskConical /></div>
                  <div><h4 className="font-bold mb-1">Lab Tested</h4><p className="text-sm text-[#4c9a9a] dark:text-gray-400">Purity and potency guaranteed by third-party testing.</p></div>
               </div>
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="p-3 rounded-lg bg-[#13ecec]/20 text-[#13ecec]"><Leaf /></div>
                  <div><h4 className="font-bold mb-1">Eco Conscious</h4><p className="text-sm text-[#4c9a9a] dark:text-gray-400">Sustainably sourced and packaged in recyclable glass.</p></div>
               </div>
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="p-3 rounded-lg bg-[#13ecec]/20 text-[#13ecec]"><Truck /></div>
                  <div><h4 className="font-bold mb-1">Fast Shipping</h4><p className="text-sm text-[#4c9a9a] dark:text-gray-400">Delivered to your door in carbon-neutral packaging.</p></div>
               </div>
            </div>

          </main>
        </motion.div>
      )}

    </div>
  );
}