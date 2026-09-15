import React from 'react';
import Link from 'next/link';
import { Film, AlertTriangle, RefreshCw, Ticket, Sparkles } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#13151F] border border-[#292D40] rounded overflow-hidden">
          <div className="w-full aspect-[2/3] bg-[#1B1E2C]" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-[#1B1E2C] rounded w-3/4" />
            <div className="h-3 bg-[#1B1E2C] rounded w-1/2" />
            <div className="h-9 bg-[#1B1E2C] rounded w-full pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({
  title = "NO MOVIES AVAILABLE",
  message = "No records were found matching your current filter or dataset.",
  actionText,
  actionHref,
  onAction,
  icon,
}) => {
  return (
    <div className="p-12 rounded bg-[#13151F] border border-[#292D40] text-center space-y-4 max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-[#E50914]/10 border border-[#E50914]/30 rounded-full flex items-center justify-center mx-auto text-[#E50914]">
        {icon || <Film className="w-7 h-7" />}
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-2xl text-white tracking-wider uppercase">{title}</h3>
        <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">{message}</p>
      </div>
      {actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#C10712] text-white text-xs font-bold tracking-widest px-5 py-2.5 rounded transition-all uppercase shadow-[0_0_12px_rgba(229,9,20,0.3)]"
          >
            <Ticket className="w-4 h-4" />
            <span>{actionText || "BROWSE CINEMAS"}</span>
          </Link>
        </div>
      )}
      {onAction && !actionHref && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-5 py-2.5 rounded transition-all uppercase"
          >
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            <span>{actionText || "RETRY ACTION"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({
  message = "Unable to load data from backend cinema server.",
  onRetry,
}) => {
  return (
    <div className="p-8 rounded bg-[#13151F] border border-[#EF4444]/40 text-center space-y-4 max-w-lg mx-auto my-8">
      <div className="w-12 h-12 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-full flex items-center justify-center mx-auto text-[#EF4444]">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl text-white tracking-wider uppercase">CONNECTION ERROR</h3>
        <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[#1B1E2C] hover:bg-[#292D40] text-white border border-[#292D40] text-xs font-bold tracking-widest px-4 py-2.5 rounded transition-colors uppercase"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#E50914]" />
          <span>RETRY REQUEST</span>
        </button>
      )}
    </div>
  );
};
