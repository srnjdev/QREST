import { TestBed } from '@angular/core/testing';

import { Dish } from './dish';

describe('Dish', () => {
  let service: Dish;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dish);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
