import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar"; // Import Navbar
import { Footer } from "@/components/layout/Footer"; // Import Footer

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
        {/* The Shell */}
        <Navbar />
        
        {/* The Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* The Footer */}
        <Footer />
      </body>
    </html>
  );
}