'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { Movie } from '@/lib/types';
import { getMoviePoster, FORMAT_BADGES } from '@/lib/constants';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/StateViews';
import { Ticket, Play, Sparkles, Star, Film, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'NOW_SHOWING' | 'UPCOMING'>('NOW_SHOWING');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    setIsLoading(true);
    setError(null);
    const res = await apiClient.fetchMovies();
    setIsLoading(false);

    if (res.success && res.data) {
      setMovies(res.data);
    } else {
      setError(typeof res.err === 'string' ? res.err : 'Failed to fetch movies from server.');
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const featuredMovie = movies.length > 0 ? movies[0] : null;
  const nowShowingMovies = movies.filter((m) => m.releaseStatus === 'Released' || !m.releaseStatus);
  const upcomingMovies = movies.filter((m) => m.releaseStatus && m.releaseStatus !== 'Released');
  const displayMovies = activeTab === 'NOW_SHOWING' ? nowShowingMovies : upcomingMovies.length > 0 ? upcomingMovies : movies;

  return (
    <div className="w-full pb-16">
      {/* Hero Banner Feature */}
      {featuredMovie ? (
        <section className="relative w-full h-[540px] bg-[#0A0B10] border-b border-[#292D40] overflow-hidden flex items-center">
          {/* Background Backdrop Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={getMoviePoster(featuredMovie.name)}
              alt={featuredMovie.name}
              fill
              className="object-cover object-top opacity-20 filter blur-sm scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-[#0A0B10]/60" />
          </div>

          <div className="max-w-[1280px] mx-auto px-4 md:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FEATURED BLOCKBUSTER</span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-normal tracking-wide text-white leading-none uppercase">
                {featuredMovie.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#9CA3AF]">
                <span className="flex items-center gap-1 text-[#F59E0B]">
                  <Star className="w-4 h-4 fill-[#F59E0B]" /> 4.9/5 RATING
                </span>
                <span>•</span>
                <span>DIRECTED BY {featuredMovie.director.toUpperCase()}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-[#1B1E2C] border border-[#292D40] text-white">
                  {featuredMovie.language}
                </span>
              </div>

              <p className="text-[#9CA3AF] text-xs md:text-sm max-w-2xl leading-relaxed line-clamp-3">
                {featuredMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/movies/${featuredMovie._id}`}
                  className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest px-6 py-3.5 rounded transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] uppercase"
                >
                  <Ticket className="w-4 h-4" />
                  <span>BOOK TICKETS NOW</span>
                </Link>
                {featuredMovie.trailerUrl && (
                  <a
                    href={featuredMovie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-6 py-3.5 rounded transition-all uppercase"
                  >
                    <Play className="w-4 h-4 text-[#E50914]" />
                    <span>WATCH TRAILER</span>
                  </a>
                )}
              </div>
            </div>

            {/* Poster Card Right Side */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden border border-[#292D40] shadow-[0_0_30px_rgba(0,0,0,0.8)] group">
                <Image
                  src={getMoviePoster(featuredMovie.name)}
                  alt={featuredMovie.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Main Grid Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
        {/* Navigation Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#292D40] pb-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('NOW_SHOWING')}
              className={`font-display text-2xl tracking-wider uppercase transition-colors relative pb-2 ${
                activeTab === 'NOW_SHOWING' ? 'text-white' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              NOW SHOWING
              {activeTab === 'NOW_SHOWING' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E50914] shadow-[0_0_8px_#E50914]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`font-display text-2xl tracking-wider uppercase transition-colors relative pb-2 ${
                activeTab === 'UPCOMING' ? 'text-white' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              UPCOMING MOVIES
              {activeTab === 'UPCOMING' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E50914] shadow-[0_0_8px_#E50914]" />
              )}
            </button>
          </div>

          <Link
            href="/theatres"
            className="text-xs font-bold text-[#E50914] hover:underline tracking-widest uppercase flex items-center gap-1"
          >
            <span>EXPLORE CINEMAS</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* State Rendering */}
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadMovies} />
        ) : displayMovies.length === 0 ? (
          <EmptyState
            title="NO MOVIES FOUND"
            message="No active movie records were found in the database. Run the seed script to populate plausible movies."
            actionText="RELOAD DATA"
            onAction={loadMovies}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayMovies.map((movie) => {
              const posterUrl = getMoviePoster(movie.name);

              return (
                <div
                  key={movie._id}
                  className="bg-[#13151F] border border-[#292D40] hover:border-[#3A3F58] rounded overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                >
                  {/* Poster Image Container */}
                  <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#1B1E2C]">
                    <Image
                      src={posterUrl}
                      alt={movie.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Format Badge Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E50914]/90 text-white shadow">
                        IMAX 3D
                      </span>
                    </div>

                    {/* Quick Hover CTA Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Link
                        href={`/movies/${movie._id}`}
                        className="w-full bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest py-2.5 rounded text-center transition-all uppercase shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                      >
                        SELECT SHOWTIMES
                      </Link>
                    </div>
                  </div>

                  {/* Movie Info Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-display text-xl text-white tracking-wide uppercase line-clamp-1 group-hover:text-[#E50914] transition-colors">
                        {movie.name}
                      </h3>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5 line-clamp-1">
                        Dir. {movie.director} • {movie.language}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#292D40]/60 flex items-center justify-between text-xs">
                      <span className="text-[#9CA3AF] text-[11px] font-medium">
                        {movie.casts && movie.casts.length > 0 ? movie.casts.slice(0, 2).join(', ') : 'Starring Cast'}
                      </span>
                      <Link
                        href={`/movies/${movie._id}`}
                        className="text-[#E50914] font-bold text-[11px] hover:underline uppercase tracking-wider"
                      >
                        BOOK →
                      </Link>
                    </div>
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
