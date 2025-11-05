import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { modelsGuard } from './models-guard';

describe('modelsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => modelsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
