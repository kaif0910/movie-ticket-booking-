'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { USER_ROLE } from '@/lib/types';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: USER_ROLE;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
        <span className="text-xs font-bold text-[#9CA3AF] tracking-widest uppercase">
          VERIFYING TICKETING SESSION...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.userRole !== requiredRole) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 flex justify-center">
        <div className="bg-[#13151F] border border-[#EF4444]/30 rounded p-8 max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-[#EF4444] mx-auto" />
          <h2 className="font-display text-2xl text-white uppercase tracking-wide">
            ACCESS RESTRICTED
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Your account role ({user?.userRole || 'CUSTOMER'}) does not have permission to view this section.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
