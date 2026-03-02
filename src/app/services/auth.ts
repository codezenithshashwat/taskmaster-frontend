import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => this.storeToken(response))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.storeToken(response))
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_email');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUsername(): string | null {
    return localStorage.getItem('auth_username');
  }

  private storeToken(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_username', response.username);
    localStorage.setItem('auth_email', response.email);
  }
}
