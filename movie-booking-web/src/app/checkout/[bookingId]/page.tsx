'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import { Booking, Movie, Theatre, Show } from '@/lib/types';
import { LoadingSkeleton, ErrorState } from '@/components/ui/StateViews';
import { CreditCard, ShieldCheck, Clock, AlertCircle, ArrowLeft, CheckCircle2, Loader2, QrCode } from 'lucide-react';

export default function CheckoutPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [show, setShow] = useState<Show | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookingDetails = async () => {
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
      setError(typeof bookingRes.err === 'string' ? bookingRes.err : 'Booking session not found or expired.');
    }
  };

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const handlePayNow = async () => {
    if (!booking) return;

    setIsProcessing(true);
    setError(null);

    const paymentRes = await apiClient.createPayment({
      bookingId: booking._id,
      amount: booking.totalCost,
    });

    setIsProcessing(false);

    if (paymentRes.success && paymentRes.data) {
      router.push(`/confirmation/${booking._id}`);
    } else {
      setError(
        typeof paymentRes.err === 'string'
          ? paymentRes.err
          : 'Payment failed. Please verify your payment details and retry.'
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#292D40] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors tracking-widest uppercase mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E50914]" />
            <span>CANCEL & RETURN HOME</span>
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-white tracking-wider uppercase">
            SECURE CHECKOUT & PAYMENT
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            Complete your ticket payment to finalize seat confirmation
          </p>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 rounded bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center gap-3 text-[#EF4444] text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton count={1} />
        ) : !booking ? (
          <ErrorState message="No active booking session found." onRetry={loadBookingDetails} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment Method Selector Left (Cols 7) */}
            <div className="lg:col-span-7 bg-[#13151F] border border-[#292D40] rounded p-6 space-y-6">
              <h2 className="font-display text-2xl text-white tracking-wider uppercase border-b border-[#292D40] pb-3">
                CHOOSE PAYMENT METHOD
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 rounded border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'CARD'
                      ? 'bg-[#E50914]/15 border-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]'
                      : 'bg-[#1B1E2C] border-[#292D40] text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#E50914]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">CREDIT / DEBIT CARD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'UPI'
                      ? 'bg-[#E50914]/15 border-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]'
                      : 'bg-[#1B1E2C] border-[#292D40] text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">UPI / GPAY / PHONEPE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3.5 rounded border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'NETBANKING'
                      ? 'bg-[#E50914]/15 border-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]'
                      : 'bg-[#1B1E2C] border-[#292D40] text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">NET BANKING</span>
                </button>
              </div>

              {/* Form Controls Preview */}
              <div className="space-y-4 pt-2">
                {paymentMethod === 'CARD' ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#9CA3AF] uppercase block">CARD NUMBER</label>
                      <input
                        type="text"
                        defaultValue="4532 •••• •••• 8892"
                        className="w-full bg-[#1B1E2C] border border-[#292D40] rounded text-xs text-white p-3 outline-none focus:border-[#E50914]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#9CA3AF] uppercase block">EXPIRY DATE</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full bg-[#1B1E2C] border border-[#292D40] rounded text-xs text-white p-3 outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#9CA3AF] uppercase block">CVV</label>
                        <input
                          type="password"
                          defaultValue="782"
                          className="w-full bg-[#1B1E2C] border border-[#292D40] rounded text-xs text-white p-3 outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'UPI' ? (
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#9CA3AF] uppercase block">ENTER VPA / UPI ID</label>
                    <input
                      type="text"
                      defaultValue="customer@okicici"
                      className="w-full bg-[#1B1E2C] border border-[#292D40] rounded text-xs text-white p-3 outline-none focus:border-[#E50914]"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#9CA3AF] uppercase block">SELECT BANK</label>
                    <select className="w-full bg-[#1B1E2C] border border-[#292D40] rounded text-xs text-white p-3 outline-none focus:border-[#E50914]">
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="w-full bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest py-3.5 px-4 rounded transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] flex items-center justify-center gap-2 uppercase disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PROCESSING PAYMENT...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>PAY ₹{booking.totalCost} & CONFIRM BOOKING</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Summary Panel Right (Cols 5) */}
            <div className="lg:col-span-5 bg-[#13151F] border border-[#292D40] rounded p-6 space-y-4">
              <h2 className="font-display text-2xl text-white tracking-wider uppercase border-b border-[#292D40] pb-3">
                SUMMARY
              </h2>

              <div className="space-y-2 text-xs text-[#9CA3AF]">
                <div className="text-white font-bold text-base">{movie ? movie.name : 'Movie Ticket'}</div>
                <p>{theatre ? `${theatre.name}, ${theatre.city}` : 'Multiplex Cinema'}</p>
                <p>Showtime: <span className="text-white font-bold">{show ? show.timing : '10:30 AM'}</span></p>
                <p>Seats: <span className="text-white font-bold font-mono">{booking.seats.join(', ')}</span></p>
              </div>

              <div className="pt-3 border-t border-[#292D40] space-y-2 text-xs">
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Tickets ({booking.seats.length}):</span>
                  <span className="text-white">₹{booking.totalCost}</span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Convenience Fee:</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#292D40] flex justify-between text-sm">
                  <span className="font-bold text-white uppercase">TOTAL DUE:</span>
                  <span className="font-display text-2xl text-[#E50914]">₹{booking.totalCost}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
