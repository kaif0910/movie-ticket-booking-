'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Ticket, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';
  const oauthError = searchParams.get('error');

  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    oauthError === 'oauth_failed' ? 'Google authentication failed. Please try again.' : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectTarget);
    } else {
      setError(typeof result.err === 'string' ? result.err : 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] bg-[#13151F] border border-[#292D40] rounded-lg p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E50914] shadow-[0_0_12px_#E50914]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-[#E50914] rounded flex items-center justify-center mx-auto text-white font-display text-2xl shadow-[0_0_15px_rgba(229,9,20,0.4)]">
            C
          </div>
          <h1 className="font-display text-3xl text-white tracking-wider uppercase pt-1">
            SIGN IN TO <span className="text-[#E50914]">CINETICKET</span>
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            Access your 7-minute seat locks, bookings, and VIP passes
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Social / Google Login */}
        <div>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-[#1B1E2C] hover:bg-[#292D40] text-white text-xs font-bold tracking-wider py-3 px-4 rounded border border-[#292D40] hover:border-[#3A3F58] transition-all uppercase"
          >
            <GoogleIcon />
            <span>CONTINUE WITH GOOGLE</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inset-x-0 h-[1px] bg-[#292D40]" />
          <span className="relative px-3 bg-[#13151F] text-[10px] font-bold text-[#6B7280] tracking-widest uppercase">
            OR SIGN IN WITH EMAIL
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase block">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                required
                className="w-full bg-[#1B1E2C] border border-[#292D40] focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded text-xs text-white placeholder-[#6B7280] pl-10 pr-3.5 py-3 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase block">
                PASSWORD
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1B1E2C] border border-[#292D40] focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded text-xs text-white placeholder-[#6B7280] pl-10 pr-3.5 py-3 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest py-3.5 px-4 rounded transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2 uppercase disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-[#292D40]/50 text-xs text-[#9CA3AF]">
          <span>Don&apos;t have a CINETICKET account? </span>
          <Link
            href="/register"
            className="text-[#E50914] hover:underline font-bold tracking-wider"
          >
            CREATE ONE HERE
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-xs text-[#9CA3AF]">
          Loading login portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
