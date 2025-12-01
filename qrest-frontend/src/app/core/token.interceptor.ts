// src/app/core/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Siempre inyectamos servicios usando `inject()` en interceptores funcionales
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();  // Obtener el token desde AuthService (consistencia)
  const isAuthEndpoint = req.url.includes('/api/auth');

  let newReq = req;

  // Adjuntar token a TODAS las peticiones excepto /api/auth/*
  if (token && !isAuthEndpoint) {
    newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

   return next(newReq).pipe(
    catchError(err => {
      // 401 en cualquier endpoint protegido => token inválido/expirado
      if (err.status === 401 && !isAuthEndpoint) {
        auth.logout(false);      // borra el token
        router.navigate(['/login']);  // redirige al login
      }
      return throwError(() => err);
    })
  );
};
