import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuth: any;
  let mockRouter: any;

  beforeEach(waitForAsync(() => {
    mockAuth = {
      login: jasmine.createSpy('login')
    };
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if fields empty', () => {
    component.username = '';
    component.password = '';
    component.submit();
    expect(component.error).toBeTruthy();
  });

  it('should login and navigate on success', () => {
    mockAuth.login.and.returnValue(of({ token: 'abc' }));
    component.username = 'user';
    component.password = 'pass';
    component.submit();
    expect(mockAuth.login).toHaveBeenCalledWith('user', 'pass');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error on login failure', () => {
    mockAuth.login.and.returnValue(throwError(() => ({ error: 'invalid' })));
    component.username = 'user';
    component.password = 'wrong';
    component.submit();
    expect(component.error).toBe('invalid');
  });
});
