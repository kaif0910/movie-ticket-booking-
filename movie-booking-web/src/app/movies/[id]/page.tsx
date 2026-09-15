'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { Movie, Show, Theatre } from '@/lib/types';
import { getMoviePoster, FORMAT_BADGES } from '@/lib/constants';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/StateViews';
import { Ticket, MapPin, Calendar, Clock, Star, Play, Sparkles, ArrowLeft, Film } from 'lucide-react';

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: movieId } = use(params);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Record<string, Theatre>>({});
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovieDetailsAndShows = async () => {
    setIsLoading(true);
    setError(null);

    const [movieRes, showsRes, theatresRes] = await Promise.all([
      apiClient.getMovieById(movieId),
      apiClient.getShows({ movieId }),
      apiClient.getAllTheatres(),
    ]);

    setIsLoading(false);

    if (movieRes.success && movieRes.data) {
      setMovie(movieRes.data);
    } else {
      setError(typeof movieRes.err === 'string' ? movieRes.err : 'Unable to find movie details.');
      return;
    }

    if (showsRes.success && showsRes.data) {
      setShows(showsRes.data);
    }

    if (theatresRes.success && theatresRes.data) {
      const theatreMap: Record<string, Theatre> = {};
      theatresRes.data.forEach((t) => {
        theatreMap[t._id] = t;
      });
      setTheatres(theatreMap);
    }
  };

  useEffect(() => {
    loadMovieDetailsAndShows();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <ErrorState message={error || 'Movie not found.'} onRetry={loadMovieDetailsAndShows} />
      </div>
    );
  }

  const filteredShows = selectedFormat === 'ALL'
    ? shows
    : shows.filter((s) => s.format === selectedFormat);

  // Group shows by Theatre ID
  const showsByTheatre: Record<string, Show[]> = {};
  filteredShows.forEach((show) => {
    const tId = typeof show.theatreId === 'object' ? show.theatreId._id : show.theatreId;
    if (!showsByTheatre[tId]) showsByTheatre[tId] = [];
    showsByTheatre[tId].push(show);
  });

  return (
    <div className="w-full pb-16">
      {/* Back Button */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 text-[#E50914]" />
          <span>BACK TO NOW SHOWING</span>
        </Link>
      </div>

      {/* Hero Movie Overview Header */}
      <section className="relative w-full bg-[#0A0B10] py-8 my-4 border-b border-[#292D40]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Poster Art Left */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-[#292D40] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <Image
                src={getMoviePoster(movie.name)}
                alt={movie.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details Right */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E50914] text-white">
                  NOW IN CINEMAS
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#1B1E2C] border border-[#292D40] text-white">
                  {movie.language}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B]">
                  4.9 RATING
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-normal tracking-wide text-white uppercase leading-none">
                {movie.name}
              </h1>

              <p className="text-xs text-[#9CA3AF] font-medium">
                Directed by <span className="text-white font-bold">{movie.director}</span> • Release Date: {movie.releaseDate}
              </p>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h3 className="font-display text-lg text-white tracking-wider uppercase">ABOUT THE MOVIE</h3>
              <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Cast List */}
            {movie.casts && movie.casts.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display text-sm text-[#9CA3AF] tracking-wider uppercase">STARRING CAST</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.casts.map((actor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded bg-[#13151F] border border-[#292D40] text-xs text-white font-medium"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer Action */}
            {movie.trailerUrl && (
              <div>
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-5 py-2.5 rounded transition-colors uppercase"
                >
                  <Play className="w-4 h-4 text-[#E50914]" />
                  <span>WATCH OFFICIAL TRAILER</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Showtimes & Cinemas Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292D40] pb-4">
          <div>
            <h2 className="font-display text-3xl text-white tracking-wider uppercase">SELECT SHOWTIME & CINEMA</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Click a showtime to proceed to interactive seat selection</p>
          </div>

          {/* Format Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#13151F] p-1 rounded border border-[#292D40]">
            {['ALL', '2D', '3D', 'IMAX'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition-all ${
                  selectedFormat === fmt
                    ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.4)]'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {fmt === 'ALL' ? 'ALL FORMATS' : fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Shows Grouped by Theatre */}
        {Object.keys(showsByTheatre).length === 0 ? (
          <EmptyState
            title="NO SHOWTIMES AVAILABLE"
            message="No showtimes found for the selected format filter. Please try selecting 'ALL FORMATS' or check back later."
            icon={<Clock className="w-7 h-7" />}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(showsByTheatre).map(([theatreId, theatreShows]) => {
              const theatre = theatres[theatreId];
              const theatreName = theatre ? theatre.name : `Cinema #${theatreId.slice(-6)}`;
              const theatreAddress = theatre ? `${theatre.address}, ${theatre.city}` : 'Premier Multiplex';

              return (
                <div
                  key={theatreId}
                  className="bg-[#13151F] border border-[#292D40] rounded p-6 space-y-4 hover:border-[#3A3F58] transition-colors"
                >
                  {/* Theatre Info Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#292D40]/60 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#E50914]" />
                        <h3 className="font-display text-2xl text-white tracking-wider uppercase">
                          {theatreName}
                        </h3>
                      </div>
                      <p className="text-xs text-[#9CA3AF] pl-6">{theatreAddress}</p>
                    </div>

                    <span className="text-[11px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded border border-[#F59E0B]/30 self-start sm:self-auto">
                      ATOMIC SEAT LOCK ENABLED
                    </span>
                  </div>

                  {/* Showtimes Pills */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {theatreShows.map((show) => {
                      const badgeInfo = FORMAT_BADGES[show.format] || FORMAT_BADGES['2D'];

                      return (
                        <Link
                          key={show._id}
                          href={`/booking/${show._id}`}
                          className="group bg-[#1B1E2C] hover:bg-[#E50914] border border-[#292D40] hover:border-[#E50914] rounded p-3 text-center transition-all duration-200 min-w-[140px] shadow-sm hover:shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                        >
                          <div className="text-xs font-bold text-[#9CA3AF] group-hover:text-white uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-[#E50914] group-hover:text-white" />
                            <span>{show.timing}</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#292D40] group-hover:border-white/30 text-[11px]">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${badgeInfo.bg} ${badgeInfo.text} group-hover:bg-white/20 group-hover:text-white`}>
                              {show.format}
                            </span>
                            <span className="font-bold text-white group-hover:text-white">
                              ₹{show.price}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
