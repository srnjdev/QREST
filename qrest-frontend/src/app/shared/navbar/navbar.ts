import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}
   logout() {
    this.auth.logout();          // elimina el token
    this.router.navigate(['/login']); // redirige al login
  }
}
