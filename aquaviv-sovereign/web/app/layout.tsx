import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Script from 'next/script';
import { ChatWidget } from '@/components/ai/ChatWidget'; // ✅ Imported
import { Toaster } from 'sonner';

// Providers
import { CartProvider } from '@/components/providers/CartContext';
import { ReferralProvider } from '@/components/providers/ReferralContext';

// Components
import { PageShell } from '@/components/layout/PageShell';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { KLAVIYO_SCRIPT_URL } from '@/lib/klaviyo';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aquaViv | Advanced Cellular Hydration',
  description: 'Clinical grade minerals for cellular hydration.',
  icons: {
    icon: '/icon.svg',
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
        <Suspense fallback={
          <div className="fixed top-0 w-full h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 flex items-center px-6">
            <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
          </div>
        }>
          <ReferralProvider>
            <CartProvider>
              
              <PageShell>
                {children}
              </PageShell>

              {/* ✅ ADDED: The Chat Widget was missing here! */}
              <ChatWidget />
              
              <GoogleAnalytics />
              <Script 
                id="klaviyo-init"
                strategy="afterInteractive"
                src={KLAVIYO_SCRIPT_URL}
              />
              <Toaster position="top-center" richColors />
            </CartProvider>
          </ReferralProvider>
        </Suspense>
      </body>
    </html>
  );
}