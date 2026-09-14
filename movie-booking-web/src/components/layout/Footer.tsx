import React from 'react';
import Link from 'next/link';
import { Film, Shield, PhoneCall, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#07080C] border-t border-[#1C1E2A] text-[#9CA3AF] text-xs pt-12 pb-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center font-display text-xl text-white">
              C
            </div>
            <span className="font-display text-xl text-white tracking-wider">
              CINE<span className="text-[#E50914]">TICKET</span>
            </span>
          </div>
          <p className="leading-relaxed text-[#6B7280]">
            The ultimate cinematic reservation platform. Instant seat selection, 
            IMAX 3D experiences, and seamless digital booking.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm text-white tracking-widest uppercase mb-4">NOW SHOWING</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/" className="hover:text-white transition-colors">Action & Thriller</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Sci-Fi Blockbusters</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">IMAX 3D Specials</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Coming Soon</Link></li>
          </ul>
        </div>

        {/* Partner Cinemas */}
        <div>
          <h4 className="font-display text-sm text-white tracking-widest uppercase mb-4">EXPERIENCES</h4>
          <ul className="space-y-2 font-medium">
            <li><span className="text-[#E50914] font-bold mr-2">IMAX</span> 70mm Laser</li>
            <li><span className="text-[#F59E0B] font-bold mr-2">VIP</span> Director&apos;s Lounge</li>
            <li><span className="text-blue-400 font-bold mr-2">4DX</span> Motion Seats</li>
            <li><span className="text-emerald-400 font-bold mr-2">DOLBY</span> Atmos Sound</li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div>
          <h4 className="font-display text-sm text-white tracking-widest uppercase mb-4">CUSTOMER SUPPORT</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#E50914]" />
              <span>24/7 Helpline: 1800-CINE-PASS</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              <span>100% Guaranteed Seat Lock</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Official Cinema Ticketing Partner</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6 border-t border-[#141622] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280]">
        <p>© {new Date().getFullYear()} CINETICKET Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Refund & Lock Policy</Link>
        </div>
      </div>
    </footer>
  );
};
