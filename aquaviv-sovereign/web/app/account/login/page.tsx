'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; 
import { login } from '@/app/actions/auth';
import { FadeIn } from '@/components/ui/FadeIn';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" // <--- EXPLICITLY SET TYPE
      disabled={pending}
      className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-[#002a55] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Accessing Secure Vault...</span>
        </>
      ) : (
        <>
          <span>Enter Command Center</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);
  const router = useRouter();

  // Debugging: Log state changes to the console
  useEffect(() => {
    console.log("Login State Changed:", state);
    if (state?.success) {
      console.log("Redirecting to dashboard...");
      router.push('/account/dashboard');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT: The Visual Ritual */}
      <div className="hidden lg:block relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-16 text-white">
          <Link href="/">
             <div className="relative w-32 h-10 brightness-0 invert">
              <Image src="/logo.svg" alt="aquaViv" fill className="object-contain object-left" />
             </div>
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              "The only true wealth is biological sovereignty."
            </h2>
            <div className="flex gap-4 items-center opacity-80">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                 <span className="text-xl">💧</span>
              </div>
              <div>
                <p className="font-bold text-sm">Join 12,000+ Members</p>
                <p className="text-xs text-slate-400">Optimizing daily with aquaViv</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: The Gate */}
      <div className="flex items-center justify-center p-8 bg-surface-light">
        <FadeIn className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-block mb-8 relative w-32 h-10">
               <Image src="/logo.png" alt="aquaViv" fill className="object-contain" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Member Access</h1>
            <p className="text-slate-500 mt-2">Log in to manage your protocol and rewards.</p>
          </div>

          {/* DEBUG AREA: Only visible if something returns but fails to render */}
          {state && !state.success && !state.error && (
             <div className="bg-yellow-100 text-yellow-800 p-2 text-xs font-mono break-all border border-yellow-200 rounded">
                DEBUG: State received but no error message? <br/>
                {JSON.stringify(state)}
             </div>
          )}

          <form action={formAction} className="space-y-6">
            
            {/* Error Message Display */}
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center gap-3 border border-red-100 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{state.error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                autoComplete="email"
                placeholder="alex@example.com"
                className="w-full h-12 px-4 rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-white text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot?</a>
              </div>
              <input 
                name="password"
                type="password" 
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-white text-slate-900"
              />
            </div>

            <SubmitButton />

            <div className="text-center text-sm text-slate-500">
              New to the protocol? <Link href="/account/register" className="text-primary font-bold hover:underline">Apply for Access</Link>
            </div>
          </form>

          <div className="pt-8 border-t border-slate-200 text-center">
             <p className="text-xs text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               Secure Encryption Active
             </p>
          </div>

        </FadeIn>
      </div>
    </div>
  );
}