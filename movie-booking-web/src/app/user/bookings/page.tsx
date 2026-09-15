import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function UserBookingsPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 space-y-6">
        <div className="p-8 rounded bg-[#13151F] border border-[#292D40]">
          <h1 className="font-display text-4xl text-white tracking-wider uppercase">MY RESERVED TICKETS</h1>
          <p className="text-xs text-[#9CA3AF] mt-2">
            Protected User Bookings Shell — View current & past movie bookings and payment statuses
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
