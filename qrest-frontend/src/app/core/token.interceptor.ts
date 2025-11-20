// src/app/core/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // asegura que el login guarde el token con esta key
  const isAuthEndpoint = req.url.includes('/api/auth');
 if (token && !isAuthEndpoint) {
  console.log('Attaching token to', req.url, token?.slice?.(0,20) + '...');
  req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
}

  return next(req);
};
