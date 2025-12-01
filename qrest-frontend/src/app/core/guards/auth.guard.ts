// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // control de roles opcional
  const requiredRoles: string[] = route.data?.['roles'] ?? [];
  if (requiredRoles.length > 0) {
    const userRoles = auth.getUserRoles() ?? [];
    const ok = requiredRoles.some(r => userRoles.includes(r));
    if (!ok) {
      router.navigate(['/']); // o a una página "no autorizado"
      return false;
    }
  }

  return true;
};
