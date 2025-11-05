import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishForm } from './dish-form';

describe('DishForm', () => {
  let component: DishForm;
  let fixture: ComponentFixture<DishForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
