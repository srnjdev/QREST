// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = null;
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: token => {
        this.loading = false;
        // token ya guardado por AuthService
        // redirigir a dashboard o a la ruta que quieras
        this.router.navigateByUrl('/');
      },
      error: err => {
        this.loading = false;
        // mostrar mensaje claro al usuario
        this.error = err?.message ?? 'Login failed';
      }
    });
  }
}
