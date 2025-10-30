import { TestBed } from '@angular/core/testing';

import { Qr } from './qr';

describe('Qr', () => {
  let service: Qr;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Qr);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
