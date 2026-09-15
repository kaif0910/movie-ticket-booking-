'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import { Booking, Movie, Theatre, Show } from '@/lib/types';
import { getMoviePoster } from '@/lib/constants';
import { LoadingSkeleton, ErrorState } from '@/components/ui/StateViews';
import { CheckCircle2, Ticket, MapPin, Clock, Calendar, Download, Printer, ArrowRight } from 'lucide-react';

export default function ConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [show, setShow] = useState<Show | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooking = async () => {
    setIsLoading(true);
    setError(null);

    const bookingRes = await apiClient.getBookingById(bookingId);
    setIsLoading(false);

    if (bookingRes.success && bookingRes.data) {
      setBooking(bookingRes.data);

      const sId = typeof bookingRes.data.showId === 'object' ? bookingRes.data.showId._id : bookingRes.data.showId;
      const tId = typeof bookingRes.data.theatreId === 'object' ? bookingRes.data.theatreId._id : bookingRes.data.theatreId;

      const [showsRes, tRes] = await Promise.all([
        apiClient.getShows(),
        apiClient.getTheatreById(tId),
      ]);

      if (showsRes.success && showsRes.data) {
        const targetShow = showsRes.data.find((s) => s._id === sId);
        if (targetShow) {
          setShow(targetShow);
          const mId = typeof targetShow.movieId === 'object' ? targetShow.movieId._id : targetShow.movieId;
          const mRes = await apiClient.getMovieById(mId);
          if (mRes.success && mRes.data) setMovie(mRes.data);
        }
      }

      if (tRes.success && tRes.data) setTheatre(tRes.data);
    } else {
      setError(typeof bookingRes.err === 'string' ? bookingRes.err : 'Booking record not found.');
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  return (
    <ProtectedRoute>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 space-y-8 flex flex-col items-center">
        {isLoading ? (
          <LoadingSkeleton count={1} />
        ) : error || !booking ? (
          <ErrorState message={error || 'Ticket confirmation unavailable.'} onRetry={loadBooking} />
        ) : (
          <div className="w-full max-w-xl space-y-6">
            {/* Top Success Announcement Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#10B981]/15 border border-[#10B981]/40 rounded-full flex items-center justify-center mx-auto text-[#10B981]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-display text-4xl text-white tracking-wider uppercase">BOOKING CONFIRMED!</h1>
              <p className="text-xs text-[#9CA3AF]">
                Your ticket pass is active. Present this digital pass or QR at the cinema entrance.
              </p>
            </div>

            {/* Authentic Cinema Ticket Stub Card */}
            <div className="ticket-stub border border-[#292D40] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
              {/* Ticket Stub Top Section */}
              <div className="p-6 md:p-8 bg-[#13151F] space-y-6">
                <div className="flex items-center justify-between border-b border-[#292D40] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#E50914] rounded flex items-center justify-center font-display text-base text-white">
                      C
                    </div>
                    <span className="font-display text-lg text-white tracking-wider">
                      CINE<span className="text-[#E50914]">PASS</span>
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold tracking-widest uppercase">
                    CONFIRMED & PAID
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-6 items-center">
                  {/* Poster Image */}
                  <div className="col-span-4">
                    <div className="relative w-full aspect-[2/3] rounded border border-[#292D40] overflow-hidden">
                      <Image
                        src={getMoviePoster(movie ? movie.name : '')}
                        alt={movie ? movie.name : 'Movie Poster'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="col-span-8 space-y-3">
                    <h2 className="font-display text-2xl md:text-3xl text-white tracking-wider uppercase leading-none">
                      {movie ? movie.name : 'Movie Pass'}
                    </h2>

                    <div className="space-y-1.5 text-xs text-[#9CA3AF]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                        <span className="text-white font-medium">
                          {theatre ? theatre.name : 'Multiplex Cinema'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Showtime: <strong className="text-white">{show ? show.timing : '10:30 AM'}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Seats: <strong className="text-white font-mono">{booking.seats.join(', ')}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perforated Dashed Tear Line */}
              <div className="relative bg-[#13151F] px-6">
                <div className="border-b-2 border-dashed border-[#292D40]" />
              </div>

              {/* Ticket Stub Bottom Barcode Section */}
              <div className="p-6 bg-[#0E1018] space-y-4">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">BOOKING ID</span>
                    <span className="font-mono text-white text-xs">{booking._id}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">TOTAL PAID</span>
                    <span className="font-display text-xl text-[#E50914]">₹{booking.totalCost}</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-2 text-center">
                  <div className="w-full h-12 bg-white/90 rounded flex items-center justify-center p-2 gap-1 overflow-hidden">
                    {Array.from({ length: 36 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-full bg-black ${idx % 3 === 0 ? 'w-1' : idx % 5 === 0 ? 'w-1.5' : 'w-0.5'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-[#6B7280] tracking-widest uppercase block mt-1">
                    *{booking._id.toUpperCase()}*
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/user/bookings"
                className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest px-6 py-3.5 rounded transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] uppercase"
              >
                <Ticket className="w-4 h-4" />
                <span>VIEW MY BOOKINGS</span>
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-6 py-3.5 rounded transition-all uppercase"
              >
                <Printer className="w-4 h-4 text-[#9CA3AF]" />
                <span>PRINT PASS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
