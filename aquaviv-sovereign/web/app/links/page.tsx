'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Check, ArrowRight, PlayCircle, MessageCircle, Star, 
  HelpCircle, Camera, ArrowUp, ChevronLeft, Info, X,
  Instagram
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- CONFIGURATION ---
const YOUTUBE_VIDEO_ID = "NoJwmTojdWk"; // <--- REPLACE THIS WITH YOUR REAL ID

// --- TYPES ---
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
};

export default function SocialHubPage() {
  const [showChat, setShowChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // <--- New State for Video
  
  // --- CHAT STATE ---
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to the Ritual. Need help with your order or protocol?",
      sender: 'bot',
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showChat]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Connection error.",
        sender: 'bot',
      };
      
      setMessages(prev => [...prev, botReply]);

    } catch (error) {
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Signal interrupted. Please check your connection.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center bg-[#f6f8f8] dark:bg-[#102222] transition-colors duration-300 font-sans">
      
      {/* 1. BACKGROUND GLOW EFFECTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#13ecec]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#13ecec]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[540px] px-6 py-12 flex flex-col gap-6">
        
        {/* 2. HEADER */}
        <header className="flex flex-col items-center gap-4 text-center mb-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-[#13ecec] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative size-28 rounded-full border-4 border-white dark:border-[#102222] shadow-xl overflow-hidden bg-slate-100">
               <Image 
                  src="/icon.webp" 
                  alt="aquaViv Logo" 
                  fill 
                  className="object-cover" 
                  priority
                />
            </div>
            <div className="absolute bottom-1 right-1 bg-[#13ecec] text-[#0d1b1b] rounded-full p-1 border-2 border-white dark:border-[#102222] flex items-center justify-center">
              <Check size={14} strokeWidth={4} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b1b] dark:text-white">aquaViv</h1>
            <p className="text-[#4c9a9a] font-medium text-lg">Hydration, Evolved.</p>
          </div>
        </header>

        {/* 3. CARD STACK */}
        <main className="flex flex-col gap-4">
          
          {/* A. HERO: SHOP COLLECTION */}
          <Link href="/shop" className="group relative block h-40 w-full overflow-hidden rounded-2xl bg-[#13ecec] shadow-lg hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#13ecec] to-[#0d9d9d] opacity-100" />
            <div className="absolute inset-0 bg-black/10" />
            
            <div className="relative h-full flex items-end justify-between p-6">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0d1b1b]/60 mb-1">New Drop</span>
                <h2 className="text-2xl font-extrabold text-[#0d1b1b]">Shop the Collection</h2>
              </div>
              <div className="bg-white/90 p-3 rounded-full text-[#0d1b1b] group-hover:translate-x-1 transition-transform shadow-sm">
                <ArrowRight size={20} strokeWidth={3} />
              </div>
            </div>
          </Link>

          {/* B. VIDEO: MINERAL SCIENCE (Triggers Overlay) */}
          <button 
             onClick={() => setShowVideo(true)} // <--- TRIGGERS VIDEO
             className="group flex items-center gap-4 rounded-2xl bg-[#082f2f] p-5 text-white shadow-lg relative overflow-hidden hover:scale-[1.02] transition-transform duration-300 w-full text-left"
          >
             <div className="absolute right-0 top-0 w-32 h-32 bg-[#13ecec]/10 rounded-full -mr-16 -mt-16 blur-xl" />
             <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#13ecec]/20 flex items-center justify-center border border-[#13ecec]/30">
               <PlayCircle size={32} className="text-[#13ecec] fill-[#13ecec]/20" />
             </div>
             <div className="flex flex-col grow">
               <h3 className="text-lg font-bold">The Mineral Science</h3>
               <p className="text-[#13ecec]/70 text-sm">Deep-sea education series</p>
             </div>
          </button>

          {/* C. INTERACTIVE: CONTACT SUPPORT */}
          <button 
            onClick={() => setShowChat(true)}
            className="relative group flex items-center gap-4 rounded-2xl bg-white dark:bg-[#1a3a3a] p-5 shadow-sm border-2 border-[#13ecec] hover:scale-[1.02] transition-transform duration-300 text-left w-full"
          >
             <div className="absolute -inset-1 bg-[#13ecec]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-[#13ecec] flex items-center justify-center">
               <MessageCircle size={24} className="text-[#0d1b1b] fill-current" />
             </div>
             <div className="relative flex flex-col grow">
               <h3 className="text-lg font-bold text-[#0d1b1b] dark:text-white">Contact Support</h3>
               <p className="text-[#13ecec] font-bold text-sm flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ecec] opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-[#13ecec]"></span>
                 </span>
                 Active Session
               </p>
             </div>
          </button>

          {/* D. REWARDS */}
          <Link href="/account/dashboard" className="group flex items-center gap-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-md p-5 shadow-sm border border-white/20 hover:scale-[1.02] transition-transform duration-300">
             <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#13ecec]/10 flex items-center justify-center">
               <Star size={24} className="text-[#4c9a9a] fill-current" />
             </div>
             <div className="flex flex-col grow">
               <h3 className="text-lg font-bold text-[#0d1b1b] dark:text-white">Sovereign Rewards</h3>
               <p className="text-slate-500 text-sm">Unlock exclusive benefits (Free)</p>
             </div>
          </Link>

          {/* E. QUIZ */}
          <Link href="/quiz" className="group flex items-center gap-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-md p-5 shadow-sm border border-white/20 hover:scale-[1.02] transition-transform duration-300">
             <div className="flex-shrink-0 w-14 h-14 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
               <HelpCircle size={24} className="text-slate-600 dark:text-white" />
             </div>
             <div className="flex flex-col grow">
               <h3 className="text-lg font-bold text-[#0d1b1b] dark:text-white">Hydration Quiz</h3>
               <p className="text-slate-500 text-sm">Find your optimal balance</p>
             </div>
          </Link>

        </main>

        {/* 4. FOOTER */}
        <footer className="mt-8 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4">
              <Link href="https://instagram.com/aquaviv" target="_blank" className="size-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-[#13ecec] hover:text-[#102222] transition-colors text-[#0d1b1b] dark:text-white group">
                <Instagram size={18} />
              </Link>
           </div>
           <p className="text-xs text-[#4c9a9a]/60">© {new Date().getFullYear()} aquaViv. All Rights Reserved.</p>
        </footer>

      </div>

      {/* 5. IOS CHAT OVERLAY */}
      <AnimatePresence>
        {showChat && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 bg-[#102222]/40 backdrop-blur-sm z-40 hidden sm:block"
            />
            
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed z-50 flex flex-col overflow-hidden bg-[#fff] dark:bg-[#1c2a2a] shadow-2xl
                         inset-0 w-full h-[100dvh] rounded-none
                         sm:inset-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[95%] sm:max-w-[400px] sm:h-[80vh] sm:rounded-[2.5rem] sm:border sm:border-white/20"
            >
               {/* iOS Header */}
               <div className="bg-white/80 dark:bg-[#1c2a2a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-6 py-4 flex flex-col items-center relative z-10 shrink-0">
                  <div className="flex items-center justify-between w-full">
                     <button onClick={() => setShowChat(false)} className="text-[#007aff] flex items-center group">
                       <ChevronLeft size={26} className="group-active:-translate-x-1 transition-transform" /> 
                       <span className="text-lg">Back</span>
                     </button>
                     <div className="flex flex-col items-center">
                        <div className="size-10 rounded-full border border-[#13ecec] overflow-hidden mb-1 relative">
                           <Image 
                             src="/icon.webp" 
                             alt="Concierge Avatar" 
                             fill 
                             className="object-cover" 
                           />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-[#13ecec]/60 uppercase tracking-tighter">aquaViv Support</span>
                     </div>
                     <Info size={24} className="text-[#007aff]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0d1b1b] dark:text-white mt-1">The Ritual Concierge</h4>
               </div>

               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white dark:bg-[#1c2a2a] scroll-smooth">
                  <div className="text-center pt-2">
                     <span className="text-[11px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest">
                       Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                  </div>
                  
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end self-end' : 'items-start self-start'}`}
                    >
                       <div 
                         className={`px-4 py-2.5 text-sm leading-tight shadow-sm
                           ${msg.sender === 'user' 
                             ? 'bg-[#007aff] text-white rounded-[1.2rem] rounded-br-sm' 
                             : 'bg-[#e9e9eb] dark:bg-[#3a3a3c] text-black dark:text-white rounded-[1.2rem] rounded-bl-sm'
                           }`}
                       >
                          {msg.text}
                       </div>
                       {msg.sender === 'user' && (
                         <span className="text-[10px] text-gray-400 mr-1 mt-1">Delivered</span>
                       )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#e9e9eb] dark:bg-[#3a3a3c] w-fit rounded-[1.2rem] rounded-bl-sm">
                       <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                       <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100" />
                       <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               <div className="p-4 bg-white dark:bg-[#1c2a2a] border-t border-black/5 dark:border-white/5 shrink-0 pb-8 sm:pb-4">
                  <div className="flex items-center gap-2 bg-[#f2f2f7] dark:bg-white/5 rounded-full px-4 py-2 border border-black/5 dark:border-white/10">
                     <Camera size={24} className="text-gray-400 dark:text-white/40 shrink-0" />
                     <input 
                       type="text" 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Live Chat"
                       className="flex-1 bg-transparent border-none focus:ring-0 text-base p-0 text-black dark:text-white placeholder-gray-400 outline-none"
                     />
                     <button 
                       onClick={handleSend}
                       disabled={!inputValue.trim()}
                       className={`size-8 rounded-full flex items-center justify-center text-white transition-all shrink-0
                         ${inputValue.trim() ? 'bg-[#007aff] hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 cursor-default'}
                       `}
                     >
                        <ArrowUp size={16} strokeWidth={3} />
                     </button>
                  </div>
                  <div className="h-4 sm:hidden"></div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. VIDEO PLAYER OVERLAY (NEW) */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#102222]/80 backdrop-blur-3xl"
          >
            {/* The Player Container */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_-10px_rgba(19,236,236,0.3)] border border-[#13ecec]/30">
               
               {/* Close Button (Top Right) */}
               <button 
                 onClick={() => setShowVideo(false)}
                 className="absolute top-4 right-4 z-20 size-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-colors backdrop-blur-md"
               >
                 <X size={20} />
               </button>

               {/* Video Header (Top Left) */}
               <div className="absolute top-6 left-6 z-10 pointer-events-none">
                 <span className="text-[10px] uppercase tracking-[0.2em] text-[#13ecec] font-bold block mb-1">Educational Series</span>
                 <h4 className="text-sm md:text-base font-medium text-white/90 tracking-wide">The Mineral Science: Deep-Sea Ritual</h4>
               </div>

               {/* YouTube Iframe */}
               <iframe 
                 className="w-full h-full"
                 src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`} 
                 title="The Mineral Science" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                 allowFullScreen
               ></iframe>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}