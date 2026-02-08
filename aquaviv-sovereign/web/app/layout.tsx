import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Script from 'next/script';
import { ChatWidget } from '@/components/ai/ChatWidget';
import { Toaster } from 'sonner'; // <--- 1. Import This

// Providers
import { CartProvider } from '@/components/providers/CartContext';
import { ReferralProvider } from '@/components/providers/ReferralContext';

// Components
import { PageShell } from '@/components/layout/PageShell'; // <--- The only layout component we keep
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { KLAVIYO_SCRIPT_URL } from '@/lib/klaviyo';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aquaViv | Sovereign Hydration',
  description: 'Clinical grade minerals for biological sovereignty.',
  icons: {
    icon: '/icon.svg', // <--- Add this line
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {/* Vercel Best Practice: "UI Skeletons" 
  We render a 'Ghost Header' so the page height doesn't jump when the real Navbar loads.
*/}
<Suspense fallback={
  <div className="fixed top-0 w-full h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 flex items-center px-6">
    <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" /> {/* Logo Placeholder */}
  </div>
}>
          <ReferralProvider>
            {/* 2. Wrap CartProvider inside ChatProvider (or vice versa, order doesn't matter much) */}
            <CartProvider>
              
              {/* --- THE FIX: ONLY USE PAGESHELL --- */}
              {/* It automatically decides whether to show the Navbar/Footer or not. */}
              <PageShell>
                {children}
              </PageShell>
              {/* 2. PLACE CHAT WIDGET HERE (Above footer, below navs) */}
              {/* Analytics stay global */}
              <GoogleAnalytics />
              <Script 
                id="klaviyo-init"
                strategy="afterInteractive"
                src={KLAVIYO_SCRIPT_URL}
              />
              {/* 2. PLACE TOASTER HERE */}
              <Toaster position="top-center" richColors />
            </CartProvider>
          </ReferralProvider>
        </Suspense>
      </body>
    </html>
  );
}