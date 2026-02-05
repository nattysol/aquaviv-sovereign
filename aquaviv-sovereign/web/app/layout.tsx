import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react'; // <--- Fixes "Cannot find name Suspense"
import Script from 'next/script';

// Providers
import { CartProvider } from '@/components/providers/CartContext'; // <--- Fixes "Cannot find CartProvider"
import { ReferralProvider } from '@/components/providers/ReferralContext'; // <--- Fixes "Cannot find ReferralProvider"

// Analytics
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { KLAVIYO_SCRIPT_URL } from '@/lib/klaviyo';

// Components
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aquaViv | Sovereign Hydration',
  description: 'Clinical grade minerals for biological sovereignty.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {/* Suspense is required when using useSearchParams (ReferralProvider) */}
        <Suspense fallback={null}>
          <ReferralProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen pt-20">
                {children}
              </main>
              <Footer />

              {/* --- ANALYTICS SUITE --- */}
              <GoogleAnalytics />
              
              <Script 
                id="klaviyo-init"
                strategy="afterInteractive"
                src={KLAVIYO_SCRIPT_URL}
              />
              
            </CartProvider>
          </ReferralProvider>
        </Suspense>
      </body>
    </html>
  );
}