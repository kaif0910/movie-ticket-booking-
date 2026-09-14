import React from 'react';
import Link from 'next/link';
import { Film, Ticket, Sparkles, Play } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Banner Shell */}
      <section className="relative w-full h-[520px] bg-[#0A0B10] border-b border-[#1C1E2A] overflow-hidden flex items-center">
        {/* Background Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E50914]/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOW SHOWING IN IMAX 3D</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-normal tracking-wide text-white leading-none uppercase">
              EXPERIENCE THE NEXT <br />
              <span className="text-[#E50914]">CINEMATIC CHAPTER</span>
            </h1>

            <p className="text-[#9CA3AF] text-sm md:text-base max-w-xl leading-relaxed">
              Instant 7-minute atomic seat locking, Dolby Atmos sound engineering, 
              and exclusive VIP lounge access at premier theaters nationwide.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/theatres"
                className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest px-6 py-3.5 rounded transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] uppercase"
              >
                <Ticket className="w-4 h-4" />
                <span>BOOK TICKETS NOW</span>
              </Link>
              <button
                className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-6 py-3.5 rounded transition-all uppercase"
              >
                <Play className="w-4 h-4 text-[#E50914]" />
                <span>WATCH TRAILER</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container Shell */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-[#292D40] pb-4">
          <div>
            <h2 className="font-display text-3xl text-white tracking-wider uppercase">NOW IN THEATERS</h2>
            <p className="text-xs text-[#9CA3AF] mt-1">Select a movie to check shows and lock seats</p>
          </div>
          <Link
            href="/theatres"
            className="text-xs font-bold text-[#E50914] hover:underline tracking-widest uppercase"
          >
            VIEW ALL CINEMAS →
          </Link>
        </div>

        {/* Content Shell Placeholder */}
        <div className="p-8 rounded bg-[#13151F] border border-[#292D40] text-center space-y-3">
          <Film className="w-10 h-10 text-[#E50914] mx-auto opacity-80" />
          <h3 className="font-display text-xl text-white tracking-wide uppercase">CINETICKET PLATFORM INITIALIZED</h3>
          <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
            Base layout, typed API client, auth state, and design token system are active. Run the seed script to populate backend data.
          </p>
        </div>
      </div>
    </div>
  );
}
