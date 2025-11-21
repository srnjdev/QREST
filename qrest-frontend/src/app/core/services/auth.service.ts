// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface LoginResponse {
  token?: string;        // adapta si tu API usa `accessToken` u otro campo
  accessToken?: string;
  // puedes añadir otros campos devueltos (user, roles, etc.)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly LOGIN_URL = '/api/auth/login'; // ajusta si tu endpoint es otro

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, { username, password })
      .pipe(
        map(resp => {
          // la API podría devolver token en resp.token o resp.accessToken
          const token = resp?.token ?? resp?.accessToken;
          if (!token) throw new Error('No token en la respuesta del servidor');
          // guardar token en localStorage
          localStorage.setItem(this.TOKEN_KEY, token);
          return token;
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    // si quieres, puedes llamar al backend para invalidar token
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

