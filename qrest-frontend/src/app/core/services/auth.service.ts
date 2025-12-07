import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  username?: string;
  roles?: string[];
  // otros campos opcionales
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly ROLES_KEY = 'roles';
  private readonly USERNAME_KEY = 'username';
private readonly LOGIN_URL = `${environment.apiUrl}/api/auth/login`;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Realiza login, guarda token + roles en localStorage y notifica cambio.
   * Devuelve el token (Observable<string>).
   */
  login(username: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, { username, password }).pipe(
      tap(resp => {
        const token = resp?.token ?? resp?.accessToken;
        if (!token) throw new Error('No token en la respuesta del servidor');

        // Guardar token y roles (y username si viene)
        localStorage.setItem(this.TOKEN_KEY, token);

        if (Array.isArray(resp?.roles)) {
          localStorage.setItem(this.ROLES_KEY, JSON.stringify(resp.roles));
        } else {
          // fallback: si backend devolviera roles en otro campo, ajusta aquí
          localStorage.removeItem(this.ROLES_KEY);
        }

        if (resp?.username) {
          localStorage.setItem(this.USERNAME_KEY, resp.username);
        }

        // Notificar a la app que cambió el estado de autenticación (útil en zoneless apps)
        window.dispatchEvent(new CustomEvent('auth:changed', { detail: { loggedIn: true } }));
      }),
      map(resp => {
        // devolver sólo token para compatibilidad con el código existente
        return (resp?.token ?? resp?.accessToken) as string;
      })
    );
  }

  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  localStorage.removeItem('username');
  window.dispatchEvent(new CustomEvent('auth:changed'));
  this.router.navigate(['/login']);
}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Devuelve roles desde localStorage si están guardados; si no, intenta parsear el token.
   */
  getUserRoles(): string[] {
    const raw = localStorage.getItem(this.ROLES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* ignore */ }
    }

    // fallback: parse token claims
    const token = this.getToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const roles = payload?.roles ?? payload?.authorities ?? payload?.realm_access?.roles ?? [];
      if (Array.isArray(roles)) return roles.map((r: any) => String(r));
      if (typeof roles === 'string') return [roles];
      if (typeof roles === 'object') return Object.keys(roles);
    } catch (e) {
      // parse failed
    }
    return [];
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles().map(r => String(r).toUpperCase());
    return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}