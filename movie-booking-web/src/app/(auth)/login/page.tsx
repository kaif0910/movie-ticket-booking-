import React from 'react';

export default function LoginPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#13151F] border border-[#292D40] rounded p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl text-white tracking-wider uppercase">SIGN IN TO CINETICKET</h1>
          <p className="text-xs text-[#9CA3AF]">Access your booked tickets, seat locks, and payments</p>
        </div>
        <p className="text-xs text-center text-[#6B7280]">Auth Route Shell — Ready for login form integration</p>
      </div>
    </div>
  );
}
