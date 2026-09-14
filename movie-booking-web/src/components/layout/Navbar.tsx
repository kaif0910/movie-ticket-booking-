'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Ticket, MapPin, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'NOW SHOWING', icon: Film },
    { href: '/theatres', label: 'CINEMAS', icon: MapPin },
    { href: '/user/bookings', label: 'MY TICKETS', icon: Ticket, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0B10]/95 backdrop-blur-md border-b border-[#292D40]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E50914] rounded flex items-center justify-center font-display text-2xl text-white tracking-widest shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl tracking-wider text-white leading-none">
              CINE<span className="text-[#E50914]">TICKET</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#9CA3AF] font-medium uppercase">
              Cinema & Experience
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.authRequired && !isAuthenticated) return null;
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-semibold tracking-wider transition-colors py-1 relative ${
                  isActive ? 'text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E50914]' : 'text-[#9CA3AF]'}`} />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E50914] rounded-full shadow-[0_0_8px_#E50914]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA / User Controls */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/user/bookings"
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1B1E2C] hover:bg-[#292D40] border border-[#292D40] text-xs font-semibold text-white tracking-wide transition-colors"
              >
                <Ticket className="w-3.5 h-3.5 text-[#E50914]" />
                <span>My Bookings</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#9CA3AF] hover:text-white hover:bg-[#1B1E2C] transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#9CA3AF] hover:text-white tracking-wider px-3 py-2 transition-colors"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest px-4 py-2 rounded transition-all shadow-[0_0_12px_rgba(229,9,20,0.3)] hover:shadow-[0_0_18px_rgba(229,9,20,0.5)] uppercase"
              >
                GET TICKETS
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
