'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/ui/FadeIn';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  // FIXED: Added HTMLSelectElement to the type definition
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f6f8f8] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Info */}
        <FadeIn>
          <h1 className="text-4xl font-black text-[#102222] mb-6">Contact Us</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Questions about your protocol? Need help with an order? Our support team operates on high-frequency channels.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#102222]">Email</h3>
              <p className="text-slate-500">support@aquaviv.net</p>
            </div>
            <div>
              <h3 className="font-bold text-[#102222]">Headquarters</h3>
              <p className="text-slate-500">
                123 Mineral Way<br />
                Austin, TX 78701
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right: Form */}
        <FadeIn delay={0.2}>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#13ecec]/20 text-[#102222] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-[#102222]">Message Transmitted</h3>
                <p className="text-slate-500 mt-2">We will respond within 24 hours.</p>
                <button type="button" onClick={() => setStatus('idle')} className="mt-6 text-[#1152d4] font-bold text-sm underline">Send another</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Email</label>
                  <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none">
                    <option value="General">General Inquiry</option>
                    <option value="Order">Order Support</option>
                    <option value="Wholesale">Wholesale / Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Message</label>
                  <textarea required name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" />
                </div>

                <button disabled={status === 'loading'} className="w-full py-4 bg-[#102222] text-white font-bold rounded-xl hover:bg-black transition-all mt-2">
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && <p className="text-center text-red-500 text-xs font-bold">Failed to send. Please try again.</p>}
              </div>
            )}
          </form>
        </FadeIn>

      </div>
    </div>
  );
}