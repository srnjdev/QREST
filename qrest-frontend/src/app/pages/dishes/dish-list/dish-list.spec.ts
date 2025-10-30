import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishList } from './dish-list';

describe('DishList', () => {
  let component: DishList;
  let fixture: ComponentFixture<DishList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
