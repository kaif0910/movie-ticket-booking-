'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthTokenAndUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirectUrl = searchParams.get('redirect') || '/';

    if (token) {
      setAuthTokenAndUser(token);
      router.replace(redirectUrl);
    } else {
      router.replace('/login?error=oauth_failed');
    }
  }, [searchParams, setAuthTokenAndUser, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-[#13151F] border border-[#292D40] rounded p-10 max-w-md w-full text-center space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-12 bg-[#E50914]/10 border border-[#E50914]/30 rounded flex items-center justify-center mx-auto text-[#E50914]">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl text-white tracking-wider uppercase">VERIFYING GOOGLE AUTH</h1>
          <p className="text-xs text-[#9CA3AF]">
            Issuing cinema access pass and initializing user session...
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs text-[#E50914] font-bold tracking-widest uppercase">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>AUTHENTICATING</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs text-[#9CA3AF]">
          Loading callback...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
