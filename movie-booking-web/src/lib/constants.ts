/**
 * Cinema Poster Mappings and Format Helpers
 */

export const MOVIE_POSTERS: Record<string, string> = {
  "Dune: Part Two": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
  "Oppenheimer": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
  "Interstellar": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  "The Dark Knight": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
  "Spider-Man: Across the Spider-Verse": "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop"
};

export const DEFAULT_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop";

export function getMoviePoster(name: string): string {
  return MOVIE_POSTERS[name] || DEFAULT_POSTER;
}

export const FORMAT_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  IMAX: { bg: 'bg-[#F59E0B]/15 border-[#F59E0B]/40', text: 'text-[#F59E0B]', label: 'IMAX 3D' },
  '3D': { bg: 'bg-cyan-500/15 border-cyan-500/40', text: 'text-cyan-400', label: '3D REAL' },
  '2D': { bg: 'bg-[#E50914]/15 border-[#E50914]/40', text: 'text-[#E50914]', label: '2D STANDARD' },
};

// Seat Layout Configuration (6 Rows A-F x 10 Columns 1-10)
export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
