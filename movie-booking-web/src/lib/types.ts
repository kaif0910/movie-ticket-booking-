/**
 * TypeScript Data Models and API Contracts
 * Derived directly from docs/api-contract.md
 */

export type USER_ROLE = 'CUSTOMER' | 'ADMIN' | 'CLIENT';
export type USER_STATUS = 'APPROVED' | 'PENDING' | 'REJECTED';

export type BOOKING_STATUS =
  | 'IN-PROCESS'
  | 'CANCELLED'
  | 'SUCCESSFULL'
  | 'EXPIRED'
  | 'FAILED';

export type PAYMENT_STATUS = 'SUCCESS' | 'FAILED' | 'PENDING';

export type SHOW_FORMAT = '2D' | '3D' | 'IMAX';

export interface User {
  _id: string;
  name: string;
  email: string;
  userRole: USER_ROLE;
  userStatus: USER_STATUS;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Movie {
  _id: string;
  name: string;
  description: string;
  casts: string[];
  trailerUrl: string;
  director: string;
  language: string;
  releaseDate: string;
  releaseStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Theatre {
  _id: string;
  name: string;
  description?: string;
  city: string;
  pincode: number;
  address: string;
  owner: string | User;
  movies: (string | Movie)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Show {
  _id: string;
  theatreId: string | Theatre;
  movieId: string | Movie;
  timing: string;
  noOfSeats: number;
  price: number;
  format: SHOW_FORMAT;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  theatreId: string | Theatre;
  showId: string | Show;
  userId: string | User;
  seats: string[];
  totalCost: number;
  paymentId?: string;
  status: BOOKING_STATUS;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  bookingId: string | Booking;
  amount: number;
  status: PAYMENT_STATUS;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Wrapper Types
export interface ApiResponse<T = any> {
  err?: any;
  data?: T;
  message?: string;
  success?: boolean;
}

export interface AuthLoginResponse {
  email: string;
  token: string;
}

export interface SeatLockResponse {
  message?: string;
  expiresIn?: string;
  success?: boolean;
}
