'use client';

import { useState } from 'react';
import { submitApplication } from '@/app/actions';
import { User, Check, ArrowRight, Lock, AtSign, ChevronDown, Mail, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { FadeIn } from '@/components/ui/FadeIn'; // <--- Import

export default function AffiliateOnboarding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    socialReach: ''
  });
  
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitApplication(formData);

      if (result.success) {
        alert(`Application Received! Welcome to the ritual, ${formData.name}.`);
        setFormData({ name: '', email: '', category: '', socialReach: '' });
        setAgreed(false);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-light flex justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* Progress Indicator */}
        <FadeIn delay={0.1}>
          <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">Step 1 of 2</span>
              <span className="text-sm font-medium text-slate-500">Profile & Commitment</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-1/2 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.5)]"></div>
            </div>
          </div>
        </FadeIn>

        {/* Form Card */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            
            <div className="pt-10 pb-6 px-8 sm:px-12 text-center border-b border-slate-50">
              <h1 className="text-primary text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Join the Ritual
              </h1>
              <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                Partner with aquaViv to bring premium wellness technology to your community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 sm:px-12 py-10 flex flex-col gap-10">
              
              {/* Section 1: Profile */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-accent w-5 h-5" />
                  <h3 className="text-lg font-semibold text-primary">Profile Details</h3>
                </div>

                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-semibold">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full legal name"
                    className="w-full h-14 px-4 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-0 transition-all font-medium"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-semibold">Email Address</label>
                  <div className="relative">
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@example.com"
                      className="w-full h-14 px-4 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-0 transition-all font-medium"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  </div>
                </div>

                {/* Category Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-semibold">Professional Category</label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-14 px-4 rounded-lg border-2 border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-0 appearance-none transition-all font-medium cursor-pointer"
                    >
                      <option value="" disabled>Select your primary role</option>
                      <option value="influencer">Wellness Influencer</option>
                      <option value="practitioner">Holistic Practitioner</option>
                      <option value="coach">Health Coach</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Social Reach Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-semibold">Social Reach</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      value={formData.socialReach}
                      onChange={(e) => setFormData({...formData, socialReach: e.target.value})}
                      placeholder="e.g. @wellnessbyjane or 50k monthly views"
                      className="w-full h-14 px-4 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-0 transition-all font-medium"
                    />
                    <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              {/* Section 2: Commitment */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="text-accent w-5 h-5" />
                  <h3 className="text-lg font-semibold text-primary">The Ritual Commitment</h3>
                </div>

                <div 
                  onClick={() => setAgreed(!agreed)}
                  className={clsx(
                    "p-6 rounded-lg border flex items-start sm:items-center gap-5 transition-all cursor-pointer",
                    agreed ? "bg-accent/5 border-accent/30" : "bg-slate-50 border-slate-100 hover:border-primary/30"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-7 rounded-full relative transition-colors shrink-0",
                    agreed ? "bg-primary" : "bg-slate-300"
                  )}>
                    <div className={clsx(
                      "absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm",
                      agreed ? "translate-x-5" : "translate-x-0"
                    )} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-primary">Confirm Product Usage</span>
                    <span className="text-sm text-slate-500">
                      I confirm that I currently use aquaViv products in my daily practice or personal routine.
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button 
                  disabled={!agreed || isSubmitting}
                  className="group relative w-full h-14 flex items-center justify-center gap-3 bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-[#002a55] text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span>Complete Application</span>
                  )}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
                <p className="text-center text-xs text-slate-400 mt-6">
                  By applying, you agree to our <a href="#" className="underline hover:text-primary">Affiliate Terms</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
                </p>
              </div>

            </form>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="text-center opacity-60">
            <div className="flex justify-center items-center gap-2 text-xs font-medium text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Secure Encryption • Premium Partner Network</span>
            </div>
          </div>
        </FadeIn>

      </div>
    </main>
  );
}