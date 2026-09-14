import {
  ApiResponse,
  AuthLoginResponse,
  Booking,
  Movie,
  Payment,
  SeatLockResponse,
  Show,
  Theatre,
  User,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('jwt_token') || this.getCookie('jwt_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('jwt_token', token);
        document.cookie = `jwt_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        localStorage.removeItem('jwt_token');
        document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('jwt_token') || this.getCookie('jwt_token');
    }
    return this.token;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['x-access-token'] = token;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          err: data.err || data.message || `Request failed with status ${response.status}`,
          data: data.data,
          message: data.message,
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        err: error.message || 'Network error occurred',
      };
    }
  }

  // --- Auth APIs ---
  public async signup(userData: Record<string, any>): Promise<ApiResponse<User>> {
    return this.request<User>('/mba/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  public async signin(credentials: { email: string; password: string }): Promise<ApiResponse<AuthLoginResponse>> {
    const res = await this.request<AuthLoginResponse>('/mba/api/v1/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  public async resetPassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<User>> {
    return this.request<User>('/mba/api/v1/auth/resetPassword', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public getGoogleAuthUrl(): string {
    return `${API_BASE_URL}/auth/google`;
  }

  // --- User APIs ---
  public async updateUserRoleOrStatus(userId: string, data: { userRole?: string; userStatus?: string }): Promise<ApiResponse<User>> {
    return this.request<User>(`/mba/api/v1/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // --- Movie APIs ---
  public async fetchMovies(query?: { name?: string }): Promise<ApiResponse<Movie[]>> {
    const params = new URLSearchParams();
    if (query?.name) params.append('name', query.name);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<Movie[]>(`/mba/api/v1/movies${queryString}`);
  }

  public async getMovieById(movieId: string): Promise<ApiResponse<Movie>> {
    return this.request<Movie>(`/mba/api/v1/movies/${movieId}`);
  }

  public async createMovie(movieData: Record<string, any>): Promise<ApiResponse<Movie>> {
    return this.request<Movie>('/mba/api/v1/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  }

  public async updateMovie(movieId: string, data: Record<string, any>): Promise<ApiResponse<Movie>> {
    return this.request<Movie>(`/mba/api/v1/movies/${movieId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async deleteMovie(movieId: string): Promise<ApiResponse<Movie>> {
    return this.request<Movie>(`/mba/api/v1/movies/${movieId}`, {
      method: 'DELETE',
    });
  }

  // --- Theatre APIs ---
  public async getAllTheatres(): Promise<ApiResponse<Theatre[]>> {
    return this.request<Theatre[]>('/mba/api/v1/allTheatres');
  }

  public async getTheatreById(theatreId: string): Promise<ApiResponse<Theatre>> {
    return this.request<Theatre>(`/mba/api/v1/theatres/${theatreId}`);
  }

  public async getTheatresInCity(query?: {
    city?: string;
    pincode?: number;
    name?: string;
    movieId?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<Theatre[]>> {
    const params = new URLSearchParams();
    if (query?.city) params.append('city', query.city);
    if (query?.pincode) params.append('pincode', String(query.pincode));
    if (query?.name) params.append('name', query.name);
    if (query?.movieId) params.append('movieId', query.movieId);
    if (query?.limit) params.append('limit', String(query.limit));
    if (query?.skip) params.append('skip', String(query.skip));

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<Theatre[]>(`/mba/api/v1/theatres${queryString}`);
  }

  public async updateMoviesInTheatre(
    theatreId: string,
    movieIds: string[],
    insert: boolean
  ): Promise<ApiResponse<Theatre>> {
    return this.request<Theatre>(`/mba/api/v1/theatres/${theatreId}/movies`, {
      method: 'PATCH',
      body: JSON.stringify({ movieIds, insert }),
    });
  }

  public async getMoviesInTheatre(theatreId: string): Promise<ApiResponse<Theatre>> {
    return this.request<Theatre>(`/mba/api/v1/theatres/${theatreId}/movies`);
  }

  public async checkMovieInTheatre(theatreId: string, movieId: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/mba/api/v1/theatres/${theatreId}/movies/${movieId}`);
  }

  public async createTheatre(theatreData: Record<string, any>): Promise<ApiResponse<Theatre>> {
    return this.request<Theatre>('/mba/api/v1/theatres', {
      method: 'POST',
      body: JSON.stringify(theatreData),
    });
  }

  public async updateTheatre(theatreId: string, data: Record<string, any>): Promise<ApiResponse<Theatre>> {
    return this.request<Theatre>(`/mba/api/v1/theatres/${theatreId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async deleteTheatre(theatreId: string): Promise<ApiResponse<Theatre>> {
    return this.request<Theatre>(`/mba/api/v1/theatres/${theatreId}`, {
      method: 'DELETE',
    });
  }

  // --- Show APIs ---
  public async getShows(query?: { theatreId?: string; movieId?: string }): Promise<ApiResponse<Show[]>> {
    const params = new URLSearchParams();
    if (query?.theatreId) params.append('theatreId', query.theatreId);
    if (query?.movieId) params.append('movieId', query.movieId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<Show[]>(`/mba/api/v1/shows${queryString}`);
  }

  public async createShow(showData: Record<string, any>): Promise<ApiResponse<Show>> {
    return this.request<Show>('/mba/api/v1/shows', {
      method: 'POST',
      body: JSON.stringify(showData),
    });
  }

  public async updateShow(showId: string, data: Record<string, any>): Promise<ApiResponse<Show>> {
    return this.request<Show>(`/mba/api/v1/shows/${showId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async deleteShow(showId: string): Promise<ApiResponse<Show>> {
    return this.request<Show>(`/mba/api/v1/shows/${showId}`, {
      method: 'DELETE',
    });
  }

  // --- Seat APIs ---
  public async lockSeats(showId: string, seats: string[]): Promise<SeatLockResponse> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['x-access-token'] = token;

    const res = await fetch(`${API_BASE_URL}/mba/api/v1/seat/lock`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ showId, seats }),
    });

    return await res.json();
  }

  // --- Booking APIs ---
  public async createBooking(data: {
    theatreId: string;
    showId: string;
    seats: string[];
  }): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/mba/api/v1/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getUserBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/mba/api/v1/bookings');
  }

  public async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/mba/api/v1/bookings/all');
  }

  public async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/mba/api/v1/bookings/${bookingId}`);
  }

  public async updateBookingStatus(bookingId: string, status: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/mba/api/v1/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // --- Payment APIs ---
  public async createPayment(data: { bookingId: string; amount: number }): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/mba/api/v1/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getPaymentDetails(paymentId: string): Promise<ApiResponse<Payment>> {
    return this.request<Payment>(`/mba/api/v1/payments/${paymentId}`);
  }

  public async getAllPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/mba/api/v1/payments');
  }
}

export const apiClient = new ApiClient();
