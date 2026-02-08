'use client';

import { useRef, useEffect, useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '@/components/providers/ChatContext';

export function ChatModal() {
  const { isOpen, closeChat, messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. BACKDROP (Click to close) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* 2. THE WINDOW */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 md:bottom-24 right-0 md:right-6 z-50 w-full md:w-[400px] h-[85vh] md:h-[600px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-[#102222] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-[#13ecec] rounded-full animate-pulse" />
                </div>
                <span className="font-bold tracking-wide text-sm font-mono">SOVEREIGN INTEL</span>
              </div>
              <button onClick={closeChat} className="text-slate-400 hover:text-white p-2">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#102222] flex items-center justify-center text-[#13ecec] shrink-0 border border-[#13ecec]/20">
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
              {isLoading && (
                <div className="flex gap-2 p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">Processing...</span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-2 pb-8 md:pb-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#13ecec] text-slate-900"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-[#102222] text-[#13ecec] p-3 rounded-xl disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}