import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar"; // Import Navbar
import { Footer } from "@/components/layout/Footer"; // Import Footer
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/components/providers/CartContext'; // <--- Import this

export const metadata: Metadata = {
  title: "aquaViv Sovereign",
  description: "Clinical Grade Mineral Hydration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider> {/* <--- WRAP EVERYTHING INSIDE THIS */}
        {/* The Shell */}
        <Navbar />
        
        {/* The Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* The Footer */}
        <Footer />
        <MobileBottomNav /> {/* <--- ADD THIS LINE HERE */}
        </CartProvider>
      </body>
    </html>
  );
}