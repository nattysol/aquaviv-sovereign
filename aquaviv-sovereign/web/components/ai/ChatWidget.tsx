'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'name' | 'chat'>('name'); // <--- Controls the flow
  const [userName, setUserName] = useState('');
  
  // Initial State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, step]);

  // 1. HANDLE NAME SUBMIT
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setStep('chat');
    // Seed the first message with their name
    setMessages([
      { 
        role: 'assistant', 
        content: `Welcome, ${userName}. I am your hydration coach. How may I assist your hydration protocol?"` 
      }
    ]);
  };

  // 2. HANDLE CHAT SUBMIT
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMsg }],
          userName: userName // <--- Pass the name to the API
        }),
      });

      if (!response.ok) throw new Error(response.statusText);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.content += chunk;
          }
          return newHistory;
        });
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Signal interrupted. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 lg:bottom-6 right-6 z-40 p-4 bg-[#102222] text-[#13ecec] rounded-full shadow-2xl shadow-[#13ecec]/20 border border-[#13ecec]/20 transition-all ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 lg:bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[60vh] md:h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-[#102222] p-4 flex justify-between items-center text-white border-b border-[#13ecec]/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-[#13ecec] rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-[#13ecec] rounded-full animate-ping opacity-20" />
                </div>
                {/* 1. CHANGE HEADER TEXT HERE */}
                <span className="font-bold tracking-wide text-sm font-mono">aquaViv Hydration Coach</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              
              {/* STATE 1: ASK NAME */}
              {step === 'name' && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 mt-8">
                   <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#102222] flex items-center justify-center text-[#13ecec] shrink-0">
                        <Bot size={14} />
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-slate-700 text-sm">
                        {/* 2. CHANGE WELCOME TEXT HERE */}
                        Welcome to aquaViv. Before we begin, what is your first name?
                      </div>
                   </div>
                </div>
              )}

              {/* STATE 2: CHAT HISTORY */}
              {step === 'chat' && messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#102222] flex items-center justify-center text-[#13ecec] shrink-0 border border-[#13ecec]/20 shadow-sm">
                      <Bot size={14} />
                    </div>
                  )}
                  
                  <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#102222] text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#102222] flex items-center justify-center text-[#13ecec] shrink-0">
                      <Bot size={14} />
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-0" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
                   </div>
                </div>
              )}
              
              <div ref={endRef} />
            </div>

            {/* FOOTER (INPUT) */}
            <div className="p-4 bg-white border-t border-slate-100">
              {step === 'name' ? (
                <form onSubmit={handleNameSubmit} className="flex gap-2">
                  <input 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Type your name..."
                    autoFocus
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#13ecec] text-slate-900"
                  />
                  <button type="submit" className="bg-[#13ecec] text-[#102222] p-3 rounded-xl font-bold hover:brightness-110 transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about minerals..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#13ecec] text-slate-900"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-[#102222] text-[#13ecec] p-3 rounded-xl hover:bg-black disabled:opacity-50 transition-all"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}