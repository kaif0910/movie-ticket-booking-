import React from 'react';

export default async function BookingPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = await params;
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 space-y-6">
      <div className="p-8 rounded bg-[#13151F] border border-[#292D40]">
        <h1 className="font-display text-4xl text-white tracking-wider uppercase">SEAT SELECTION & LOCK (SHOW ID: {showId})</h1>
        <p className="text-xs text-[#9CA3AF] mt-2">Seat Booking Shell — Interactive seat grid layout with 7-minute atomic Redis seat locking</p>
      </div>
    </div>
  );
}
