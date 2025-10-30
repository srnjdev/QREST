import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuList } from './menu-list';

describe('MenuList', () => {
  let component: MenuList;
  let fixture: ComponentFixture<MenuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
