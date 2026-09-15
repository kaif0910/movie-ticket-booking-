'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import { Movie, Theatre, Booking } from '@/lib/types';
import { LoadingSkeleton, ErrorState } from '@/components/ui/StateViews';
import { Shield, Film, MapPin, Ticket, Plus, RefreshCw, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'MOVIES' | 'THEATRES' | 'BOOKINGS'>('MOVIES');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    setError(null);

    const [mRes, tRes, bRes] = await Promise.all([
      apiClient.fetchMovies(),
      apiClient.getAllTheatres(),
      apiClient.getAllBookings(),
    ]);

    setIsLoading(false);

    if (mRes.success && mRes.data) setMovies(mRes.data);
    if (tRes.success && tRes.data) setTheatres(tRes.data);
    if (bRes.success && bRes.data) setBookings(bRes.data);

    if (!mRes.success && !tRes.success) {
      setError('Unable to fetch admin dashboard metrics. Check admin permissions.');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292D40] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] text-[10px] font-bold tracking-widest uppercase">
              <Shield className="w-3 h-3" />
              <span>SYSTEM ADMIN PORTAL</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-white tracking-wider uppercase">
              CINEMA CONTROL DASHBOARD
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Manage catalogue movies, partner theatre locations, showtimes, and system-wide seat bookings
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-4 py-2.5 rounded transition-all uppercase self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E50914]" />
            <span>REFRESH METRICS</span>
          </button>
        </div>

        {/* System Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#13151F] border border-[#292D40] rounded p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-bold uppercase tracking-wider">TOTAL MOVIES</span>
              <Film className="w-4 h-4 text-[#E50914]" />
            </div>
            <div className="font-display text-3xl text-white">{movies.length}</div>
            <div className="text-[10px] text-[#10B981]">Active in Catalogue</div>
          </div>

          <div className="bg-[#13151F] border border-[#292D40] rounded p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-bold uppercase tracking-wider">PARTNER CINEMAS</span>
              <MapPin className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="font-display text-3xl text-white">{theatres.length}</div>
            <div className="text-[10px] text-[#F59E0B]">Multiplex Locations</div>
          </div>

          <div className="bg-[#13151F] border border-[#292D40] rounded p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-bold uppercase tracking-wider">SYSTEM BOOKINGS</span>
              <Ticket className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-display text-3xl text-white">{bookings.length}</div>
            <div className="text-[10px] text-cyan-400">Total Reservations</div>
          </div>

          <div className="bg-[#13151F] border border-[#292D40] rounded p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-bold uppercase tracking-wider">TOTAL REVENUE</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-display text-3xl text-[#10B981]">
              ₹{bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0)}
            </div>
            <div className="text-[10px] text-emerald-400">Confirmed Ticket Sales</div>
          </div>
        </div>

        {/* Tab Selector & Detailed Management Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#292D40] pb-3">
            {(['MOVIES', 'THEATRES', 'BOOKINGS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-display text-xl tracking-wider uppercase px-4 py-1.5 rounded transition-all ${
                  activeTab === tab
                    ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.4)]'
                    : 'text-[#9CA3AF] hover:text-white bg-[#13151F]'
                }`}
              >
                {tab} MANAGEMENT
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSkeleton count={2} />
          ) : error ? (
            <ErrorState message={error} onRetry={loadAdminData} />
          ) : (
            <div className="bg-[#13151F] border border-[#292D40] rounded p-6">
              {activeTab === 'MOVIES' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#292D40]">
                    <h3 className="font-display text-xl text-white uppercase tracking-wide">CATALOGUE MOVIES</h3>
                    <span className="text-xs text-[#9CA3AF]">{movies.length} movies loaded</span>
                  </div>
                  <div className="divide-y divide-[#292D40]/60">
                    {movies.map((m) => (
                      <div key={m._id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white text-sm">{m.name}</div>
                          <div className="text-[#9CA3AF]">Dir. {m.director} • {m.language} • {m.releaseDate}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#E50914]/15 text-[#E50914] font-bold text-[10px] uppercase">
                          {m.releaseStatus || 'RELEASED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'THEATRES' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#292D40]">
                    <h3 className="font-display text-xl text-white uppercase tracking-wide">THEATRE MULTIPLEXES</h3>
                    <span className="text-xs text-[#9CA3AF]">{theatres.length} cinemas registered</span>
                  </div>
                  <div className="divide-y divide-[#292D40]/60">
                    {theatres.map((t) => (
                      <div key={t._id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white text-sm">{t.name}</div>
                          <div className="text-[#9CA3AF]">{t.address}, {t.city} ({t.pincode})</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-bold text-[10px] uppercase">
                          {t.movies?.length || 0} MOVIES RUNNING
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'BOOKINGS' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#292D40]">
                    <h3 className="font-display text-xl text-white uppercase tracking-wide">SYSTEM BOOKINGS</h3>
                    <span className="text-xs text-[#9CA3AF]">{bookings.length} reservations</span>
                  </div>
                  <div className="divide-y divide-[#292D40]/60">
                    {bookings.map((b) => (
                      <div key={b._id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white font-mono">#{b._id}</div>
                          <div className="text-[#9CA3AF]">Seats: {b.seats.join(', ')} • Amount: ₹{b.totalCost}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'SUCCESSFULL' ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
