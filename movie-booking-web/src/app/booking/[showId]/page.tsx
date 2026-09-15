'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import { Show, Movie, Theatre } from '@/lib/types';
import { SEAT_ROWS, SEAT_COLS, getMoviePoster } from '@/lib/constants';
import { LoadingSkeleton, ErrorState } from '@/components/ui/StateViews';
import { Ticket, Clock, AlertCircle, ArrowLeft, Check, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function BookingPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = use(params);
  const router = useRouter();

  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(420); // 7 minutes = 420s
  const [lockExpired, setLockExpired] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLocking, setIsLocking] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShowDetails = async () => {
    setIsLoading(true);
    setError(null);

    const showsRes = await apiClient.getShows();
    if (showsRes.success && showsRes.data) {
      const targetShow = showsRes.data.find((s) => s._id === showId);
      if (targetShow) {
        setShow(targetShow);

        const mId = typeof targetShow.movieId === 'object' ? targetShow.movieId._id : targetShow.movieId;
        const tId = typeof targetShow.theatreId === 'object' ? targetShow.theatreId._id : targetShow.theatreId;

        const [mRes, tRes] = await Promise.all([
          apiClient.getMovieById(mId),
          apiClient.getTheatreById(tId),
        ]);

        if (mRes.success && mRes.data) setMovie(mRes.data);
        if (tRes.success && tRes.data) setTheatre(tRes.data);

        // Pre-booked sample seats for realistic demonstration
        setBookedSeats(['A3', 'A4', 'C6', 'D7']);
      } else {
        setError('Showtime not found.');
      }
    } else {
      setError(typeof showsRes.err === 'string' ? showsRes.err : 'Unable to load showtime details.');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadShowDetails();
  }, [showId]);

  // Live 7-minute seat lock countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isLocked && lockTimeRemaining <= 0) {
      setIsLocked(false);
      setLockExpired(true);
      setSelectedSeats([]);
    }

    return () => clearInterval(timer);
  }, [isLocked, lockTimeRemaining]);

  const handleSeatClick = (seatCode: string) => {
    if (isLocked) return;
    if (bookedSeats.includes(seatCode) || lockedSeats.includes(seatCode)) return;

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handleLockSeats = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat before locking.');
      return;
    }

    setError(null);
    setIsLocking(true);
    setLockExpired(false);

    const lockRes = await apiClient.lockSeats(showId, selectedSeats);
    setIsLocking(false);

    if (lockRes.message === 'Seats locked successfully' || lockRes.expiresIn || lockRes.success !== false) {
      setIsLocked(true);
      setLockedSeats(selectedSeats);
      setLockTimeRemaining(420);
    } else {
      setError(lockRes.message || 'One or more seats are already locked or booked.');
    }
  };

  const handleProceedToCheckout = async () => {
    if (!show || !theatre || selectedSeats.length === 0) return;

    setIsCreatingBooking(true);
    setError(null);

    const tId = theatre._id;
    const bookingRes = await apiClient.createBooking({
      theatreId: tId,
      showId: show._id,
      seats: selectedSeats,
    });

    setIsCreatingBooking(false);

    if (bookingRes.success && bookingRes.data) {
      router.push(`/checkout/${bookingRes.data._id}`);
    } else {
      setError(typeof bookingRes.err === 'string' ? bookingRes.err : 'Failed to initialize booking session.');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292D40] pb-4">
          <div className="space-y-1">
            <Link
              href={movie ? `/movies/${movie._id}` : '/'}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors tracking-widest uppercase mb-1 focus:outline-none focus:ring-1 focus:ring-[#E50914] rounded px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E50914]" />
              <span>BACK TO MOVIE</span>
            </Link>

            <h1 className="font-display text-3xl md:text-4xl text-white tracking-wider uppercase">
              {movie ? movie.name : 'SEAT SELECTION'}{' '}
              <span className="text-[#E50914]">({show?.format || '2D'})</span>
            </h1>

            <p className="text-xs text-[#9CA3AF]">
              {theatre ? `${theatre.name}, ${theatre.city}` : 'Cinema Hall'} • Showtime:{' '}
              <span className="text-white font-bold">{show?.timing}</span>
            </p>
          </div>

          {/* Atomic Redis Lock Status & Timer Banner */}
          {isLocked && (
            <div className="bg-[#F59E0B]/15 border border-[#F59E0B]/40 rounded p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Clock className="w-5 h-5 text-[#F59E0B] animate-pulse" />
              <div>
                <div className="text-[10px] font-bold text-[#F59E0B] tracking-widest uppercase">
                  ATOMIC SEAT LOCK ACTIVE
                </div>
                <div className="font-display text-2xl text-white tracking-wider">
                  EXPIRES IN: <span className="text-[#F59E0B]">{formatTimer(lockTimeRemaining)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lock Expiration Warning Alert */}
        {lockExpired && (
          <div className="p-4 rounded bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center gap-3 text-[#EF4444] text-xs">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider block">SEAT LOCK EXPIRED (7 MINS)</span>
              <span>Your atomic Redis seat lock timed out. Your seats have been visibly released back to the auditorium.</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2.5 text-[#EF4444] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton count={1} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Seat Map Visualizer Centerpiece (Cols 8) */}
            <div className="lg:col-span-8 bg-[#13151F] border border-[#292D40] rounded-lg p-6 md:p-10 space-y-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Curved Cinema Screen SVG Visualizer */}
              <div className="text-center space-y-2">
                <div className="relative w-full max-w-lg mx-auto">
                  <svg className="w-full h-9 text-[#E50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.6)]" viewBox="0 0 400 30" fill="none">
                    <path d="M 10 25 Q 200 5 390 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <span className="text-[10px] font-bold text-[#6B7280] tracking-[0.3em] uppercase block -mt-1">
                    ALL EYES THIS WAY (CURVED CINEMA SCREEN)
                  </span>
                </div>
              </div>

              {/* Grid Tactile Seat Map */}
              <div className="space-y-4 max-w-xl mx-auto pt-2">
                {/* Recliner VIP Section */}
                <div className="text-center">
                  <span className="text-[9px] font-bold text-[#F59E0B] tracking-widest uppercase bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                    VIP RECLINER TIER (ROWS A - B)
                  </span>
                </div>

                {['A', 'B'].map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="w-5 font-display text-sm text-[#9CA3AF] text-center font-bold">
                      {row}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {SEAT_COLS.map((col) => {
                        const seatCode = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatCode);
                        const isSeatLocked = lockedSeats.includes(seatCode);
                        const isSelected = selectedSeats.includes(seatCode);

                        let seatClass = "seat-available";
                        if (isBooked) seatClass = "seat-booked";
                        else if (isSeatLocked && isLocked) seatClass = "seat-locked";
                        else if (isSelected) seatClass = "seat-selected";

                        return (
                          <button
                            key={seatCode}
                            onClick={() => handleSeatClick(seatCode)}
                            disabled={isBooked || (isLocked && !isSelected)}
                            title={`Seat ${seatCode}`}
                            className={`seat-base w-7 h-7 sm:w-9 sm:h-9 text-[10px] sm:text-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#E50914] ${seatClass}`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : col}
                          </button>
                        );
                      })}
                    </div>

                    <span className="w-5 font-display text-sm text-[#9CA3AF] text-center font-bold">
                      {row}
                    </span>
                  </div>
                ))}

                {/* Executive Section */}
                <div className="text-center pt-3">
                  <span className="text-[9px] font-bold text-[#9CA3AF] tracking-widest uppercase bg-[#1B1E2C] px-2 py-0.5 rounded border border-[#292D40]">
                    EXECUTIVE TIER (ROWS C - F)
                  </span>
                </div>

                {['C', 'D', 'E', 'F'].map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="w-5 font-display text-sm text-[#9CA3AF] text-center font-bold">
                      {row}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {SEAT_COLS.map((col) => {
                        const seatCode = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatCode);
                        const isSeatLocked = lockedSeats.includes(seatCode);
                        const isSelected = selectedSeats.includes(seatCode);

                        let seatClass = "seat-available";
                        if (isBooked) seatClass = "seat-booked";
                        else if (isSeatLocked && isLocked) seatClass = "seat-locked";
                        else if (isSelected) seatClass = "seat-selected";

                        return (
                          <button
                            key={seatCode}
                            onClick={() => handleSeatClick(seatCode)}
                            disabled={isBooked || (isLocked && !isSelected)}
                            title={`Seat ${seatCode}`}
                            className={`seat-base w-7 h-7 sm:w-9 sm:h-9 text-[10px] sm:text-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#E50914] ${seatClass}`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : col}
                          </button>
                        );
                      })}
                    </div>

                    <span className="w-5 font-display text-sm text-[#9CA3AF] text-center font-bold">
                      {row}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend Bar */}
              <div className="pt-6 border-t border-[#292D40] flex flex-wrap items-center justify-center gap-6 text-xs text-[#9CA3AF]">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded seat-base seat-available" />
                  <span>AVAILABLE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded seat-base seat-selected" />
                  <span>SELECTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded seat-base seat-locked" />
                  <span>LOCKED (7 MIN)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded seat-base seat-booked" />
                  <span>BOOKED</span>
                </div>
              </div>
            </div>

            {/* Selection Summary Panel Right (Cols 4) */}
            <div className="lg:col-span-4 bg-[#13151F] border border-[#292D40] rounded-lg p-6 space-y-6 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
              <h2 className="font-display text-2xl text-white tracking-wider uppercase border-b border-[#292D40] pb-3">
                BOOKING SUMMARY
              </h2>

              <div className="space-y-3 text-xs text-[#9CA3AF]">
                <div className="flex justify-between">
                  <span>Selected Seats:</span>
                  <span className="text-white font-bold font-mono">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Ticket Price ({show ? show.format : '2D'}):</span>
                  <span className="text-white font-bold">₹{show ? show.price : 250}</span>
                </div>

                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="text-white font-bold">{selectedSeats.length} Ticket(s)</span>
                </div>

                <div className="pt-3 border-t border-[#292D40] flex justify-between text-sm">
                  <span className="font-bold text-white uppercase tracking-wider">TOTAL COST:</span>
                  <span className="font-display text-2xl text-[#E50914] font-normal">
                    ₹{show ? selectedSeats.length * show.price : 0}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {!isLocked ? (
                  <button
                    onClick={handleLockSeats}
                    disabled={selectedSeats.length === 0 || isLocking}
                    className="w-full bg-[#E50914] hover:bg-[#C10712] active:scale-[0.98] text-white text-xs font-bold tracking-widest py-3.5 px-4 rounded transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2 uppercase disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  >
                    {isLocking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>LOCKING SEATS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>LOCK SEATS (7-MIN LOCK)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={isCreatingBooking}
                    className="w-full bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] text-white text-xs font-bold tracking-widest py-3.5 px-4 rounded transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 uppercase disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    {isCreatingBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>INITIALIZING CHECKOUT...</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        <span>PROCEED TO PAYMENT</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
