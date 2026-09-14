import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 space-y-6">
      <div className="p-8 rounded bg-[#13151F] border border-[#292D40]">
        <h1 className="font-display text-4xl text-white tracking-wider uppercase">CINEMA MANAGEMENT DASHBOARD</h1>
        <p className="text-xs text-[#9CA3AF] mt-2">Admin Route Shell — Manage movies, theatres, shows, user roles, and system bookings</p>
      </div>
    </div>
  );
}
