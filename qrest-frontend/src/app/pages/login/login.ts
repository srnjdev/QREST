// src/app/pages/login/login.ts
import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  submit() {
    this.loading = false;

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        // redirigir al inicio/dashboard
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        
        if (err?.status === 401) {
          this.loading = false;
          this.toast.show('Usuario o contraseña incorrectos', 'error');
        } else if (err?.status === 403) {
          this.loading = false;
          this.toast.show('No tienes permisos para acceder', 'warning');
        } else {
          this.loading = false;
          this.toast.show('Ocurrió un error inesperado', 'error');
        }
      }
    });
  }
}
