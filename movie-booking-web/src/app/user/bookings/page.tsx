'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import { Booking, Movie, Theatre } from '@/lib/types';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/StateViews';
import { Ticket, MapPin, Calendar, Clock, AlertCircle, XCircle, ChevronRight, Loader2, Sparkles } from 'lucide-react';

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUserBookings = async () => {
    setIsLoading(true);
    setError(null);

    const res = await apiClient.getUserBookings();
    setIsLoading(false);

    if (res.success && res.data) {
      setBookings(res.data);
    } else {
      setError(typeof res.err === 'string' ? res.err : 'Unable to load your booking history.');
    }
  };

  useEffect(() => {
    loadUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    const res = await apiClient.updateBookingStatus(bookingId, 'CANCELLED');
    setCancellingId(null);

    if (res.success) {
      loadUserBookings();
    } else {
      setError(typeof res.err === 'string' ? res.err : 'Failed to cancel booking.');
    }
  };

  const filteredBookings = activeFilter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === activeFilter);

  return (
    <ProtectedRoute>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292D40] pb-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white tracking-wider uppercase">
              MY RESERVED TICKETS
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              View your active pass confirmations, seat locks, and booking history
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#13151F] p-1 rounded border border-[#292D40]">
            {['ALL', 'SUCCESSFULL', 'CANCELLED', 'EXPIRED'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all ${
                  activeFilter === status
                    ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.4)]'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {status === 'SUCCESSFULL' ? 'CONFIRMED' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2.5 text-[#EF4444] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* State Rendering */}
        {isLoading ? (
          <LoadingSkeleton count={3} />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="NO BOOKINGS FOUND"
            message="You have no reserved ticket passes matching this status. Browse our cinema catalog to book tickets."
            actionText="EXPLORE MOVIES NOW"
            actionHref="/"
            icon={<Ticket className="w-7 h-7" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((b) => {
              const isConfirmed = b.status === 'SUCCESSFULL';
              const isCancelled = b.status === 'CANCELLED';
              const isExpired = b.status === 'EXPIRED';

              let statusBadge = (
                <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wider uppercase">
                  IN-PROCESS
                </span>
              );

              if (isConfirmed) {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold tracking-wider uppercase">
                    CONFIRMED
                  </span>
                );
              } else if (isCancelled) {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-[10px] font-bold tracking-wider uppercase">
                    CANCELLED
                  </span>
                );
              } else if (isExpired) {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded bg-gray-500/15 border border-gray-500/30 text-gray-400 text-[10px] font-bold tracking-wider uppercase">
                    EXPIRED
                  </span>
                );
              }

              return (
                <div
                  key={b._id}
                  className="bg-[#13151F] border border-[#292D40] hover:border-[#3A3F58] rounded p-6 space-y-4 transition-colors relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[#292D40] pb-3">
                    <span className="font-mono text-xs text-[#9CA3AF]">ID: #{b._id.slice(-8)}</span>
                    {statusBadge}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl text-white tracking-wider uppercase">
                      RESERVED MOVIE PASS
                    </h3>

                    <div className="space-y-1.5 text-xs text-[#9CA3AF]">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Seats: <strong className="text-white font-mono">{b.seats.join(', ')}</strong></span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Total Paid: <strong className="text-[#E50914] font-display text-lg">₹{b.totalCost}</strong></span>
                        <span className="text-[10px] text-[#6B7280]">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#292D40] flex items-center justify-between">
                    {isConfirmed ? (
                      <Link
                        href={`/confirmation/${b._id}`}
                        className="text-xs font-bold text-[#E50914] hover:underline uppercase tracking-wider flex items-center gap-1"
                      >
                        <span>VIEW PASS TICKET</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-[#6B7280]">No active ticket stub</span>
                    )}

                    {!isCancelled && !isExpired && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] text-[11px] font-bold tracking-wider uppercase transition-colors disabled:opacity-50"
                      >
                        {cancellingId === b._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>CANCEL</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
