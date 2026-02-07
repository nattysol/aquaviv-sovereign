import Link from 'next/link';
import { Droplet, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-dark text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-tr-md rounded-bl-md" />
              <span className="text-xl font-bold tracking-tight">aquaViv</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Restoring cellular hydration through clinical-grade minerals.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold text-accent mb-4 uppercase tracking-wider text-xs">Shop</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">Our Collection</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold text-accent mb-4 uppercase tracking-wider text-xs">Company</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Science</Link></li>
              <li><Link href="/affiliate/join" className="hover:text-white transition-colors">Affiliate Program</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter (Functional UI) */}
          <div>
             <h3 className="font-bold text-accent mb-4 uppercase tracking-wider text-xs">Stay Hydrated</h3>
             <p className="text-slate-400 text-xs mb-4">Join the research list for protocol updates.</p>
             <div className="flex">
               <input 
                 type="email" 
                 placeholder="Enter email" 
                 className="bg-slate-800 border-none text-white placeholder:text-slate-500 text-sm px-4 py-2 rounded-l-md w-full focus:ring-1 focus:ring-accent"
               />
               <button className="bg-accent text-primary font-bold px-4 py-2 rounded-r-md text-sm hover:bg-white transition-colors">
                 Join
               </button>
             </div>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 aquaViv. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}