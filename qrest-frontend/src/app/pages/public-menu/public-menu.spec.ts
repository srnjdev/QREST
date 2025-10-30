import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenu } from './public-menu';

describe('PublicMenu', () => {
  let component: PublicMenu;
  let fixture: ComponentFixture<PublicMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
