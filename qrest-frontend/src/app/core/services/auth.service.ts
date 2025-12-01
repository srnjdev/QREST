import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  // otros campos opcionales
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly LOGIN_URL = '/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Realiza login y guarda token en localStorage.
   * Devuelve el token (Observable<string>).
   */
  login(username: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, { username, password })
      .pipe(
        map(resp => {
          const token = resp?.token ?? resp?.accessToken;
          if (!token) throw new Error('No token en la respuesta del servidor');
          localStorage.setItem(this.TOKEN_KEY, token);
          return token;
        })
      );
  }

  /**
   * Logout: borra token y (opcional) redirige al login.
   * Usado por el interceptor cuando detecta 401.
   */
  logout(redirect = true) {
    localStorage.removeItem(this.TOKEN_KEY);
    if (redirect) {
      // limpia query params y redirige
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * isLoggedIn: true si hay token Y no está expirado.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  // ----------------------
  // Utilidades JWT (sin librería)
  // ----------------------
  private urlBase64Decode(str: string) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) str += '='.repeat(4 - pad);
    return atob(str);
  }

  private parseJwt(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(this.urlBase64Decode(payload));
    } catch (e) {
      return null;
    }
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = this.parseJwt(token);
    // Ajusta según claim: 'roles', 'authorities' o como lo pongas en el server
    const roles = payload?.roles ?? payload?.authorities ?? [];
    // Asegurarse de que siempre devuelva array de strings
    return Array.isArray(roles) ? roles : [roles].filter(Boolean);
  }

  isTokenExpired(token: string): boolean {
    const payload = this.parseJwt(token);
    if (!payload) return true; // si no podemos parsear, tratar como expirado
    if (!payload.exp) return false; // si no viene exp, asumimos válido
    const expMs = payload.exp * 1000;
    return Date.now() > expMs;
  }

  /**
   * Helper: si hay ?returnUrl en la ruta actual, navegar a él; si no, ir a ruta por defecto.
   * Úsalo desde LoginComponent tras login exitoso.
   */
  navigateAfterLogin(defaultPath = '/') {
    // NOTE: no accedemos a ActivatedRoute aquí; el LoginComponent puede leer returnUrl desde snapshot.
    this.router.navigateByUrl(defaultPath);
  }
}
