import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_AGENT';
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_AGENT';
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_AGENT';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(map(response => {
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return response;
      }));
  }

  signup(userData: SignupRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(map(response => {
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isDeliveryAgent(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'DELIVERY_AGENT';
  }

  sendVerificationOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification-otp`, { email })
      .pipe(map((response: any) => {
        if (response.otp) {
          alert(`Your verification OTP is: ${response.otp}`);
        }
        return response;
      }));
  }

  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, otp });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email })
      .pipe(map((response: any) => {
        if (response.otp) {
          alert(`Your password reset OTP is: ${response.otp}`);
        }
        return response;
      }));
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, otp, newPassword });
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData);
  }
}