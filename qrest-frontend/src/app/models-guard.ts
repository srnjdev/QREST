import { CanActivateFn } from '@angular/router';

export const modelsGuard: CanActivateFn = (route, state) => {
  return true;
};
