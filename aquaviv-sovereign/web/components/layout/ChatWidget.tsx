'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "I am the Sovereign AI. Ask me about the hydration protocol." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-scroll to bottom whenever messages change
  const endRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // --- THE CORE LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput(''); // Clear input immediately
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // 1. Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          // We send the entire history so the AI remembers context
          messages: [...messages, { role: 'user', content: userMsg }] 
        }),
      });

      if (!response.ok) throw new Error(response.statusText);
      if (!response.body) throw new Error("No response body");

      // 2. Prepare the Stream Reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Add a placeholder for the AI's answer
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      // 3. Read the Stream (The "Magic Loop")
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Update the last message in real-time
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection interrupted. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING TRIGGER BUTTON */}
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 lg:bottom-6 right-6 z-40 p-4 bg-[#102222] text-[#13ecec] rounded-full shadow-2xl shadow-[#13ecec]/20 border border-[#13ecec]/20 transition-all ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* 2. CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 lg:bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[60vh] md:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-[#102222] p-4 flex justify-between items-center text-white border-b border-[#13ecec]/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-[#13ecec] rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-[#13ecec] rounded-full animate-ping opacity-20" />
                </div>
                <span className="font-bold tracking-wide text-sm font-mono">SOVEREIGN INTEL</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
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

                  {msg.role === 'user' && (
                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                       <User size={14} />
                     </div>
                  )}
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#102222] flex items-center justify-center text-[#13ecec] shrink-0">
                      <Bot size={14} />
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </div>
              )}
              
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#13ecec] focus:ring-1 focus:ring-[#13ecec] text-slate-900 transition-all"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-[#102222] text-[#13ecec] p-3 rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}