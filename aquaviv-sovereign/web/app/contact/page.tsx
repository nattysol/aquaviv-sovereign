'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  // 1. ADD THIS STATE
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  // 2. ADD THESE FUNCTIONS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'General', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  // THE TYPESCRIPT FIX IS HERE: Added HTMLSelectElement
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <main className="bg-surface-light min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <FadeIn>
              <h1 className="text-4xl font-black text-slate-900 mb-6">Contact aquaViv</h1>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                Whether you have questions about your protocol, wholesale inquiries, or partnership opportunities, our team is ready to assist.
              </p>

              <div className="space-y-8">
                <ContactItem 
                  icon={<Mail className="w-6 h-6 text-accent" />}
                  title="Support Protocol"
                  content="hello@aquaviv.net"
                  sub="Response within 24 hours"
                />
                <ContactItem 
                  icon={<MessageSquare className="w-6 h-6 text-primary" />}
                  title="Wholesale & Partners"
                  content="hello@aquaviv.net"
                  sub="Join aquaViv network"
                />
                <ContactItem 
                  icon={<MapPin className="w-6 h-6 text-slate-900" />}
                  title="Headquarters"
                  content="Las Vegas, NV"
                  sub="United States"
                />
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <FadeIn delay={0.2} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl">
             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">First Name</label>
                   <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="John" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Last Name</label>
                   <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Doe" />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Email Address</label>
                 <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="john@example.com" />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Topic</label>
                 <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all">
                   <option>General Inquiry</option>
                   <option>Order Support</option>
                   <option>Wholesale / Partnership</option>
                   <option>Product Question</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Message</label>
                 <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="How can we help you?" />
               </div>

               <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-primary/20">
                 Send Message
               </button>
             </form>
          </FadeIn>

        </div>
      </div>
    </main>
  );
}

function ContactItem({ icon, title, content, sub }: { icon: any, title: string, content: string, sub: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-slate-900 font-medium">{content}</p>
        <p className="text-sm text-slate-400">{sub}</p>
      </div>
    </div>
  )
}