// src/app/pages/users/user-list.ts
import { ChangeDetectorRef, Component, NgZone,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../models/user.model';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.html'
})
export class UserListComponent {
  users: UserDTO[] = [];
  loading = false;
  page = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: ToastService,
    private ngZone: NgZone,   // <-- inyectar NgZone
    private cdr: ChangeDetectorRef
  ) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.userService.list(this.page).subscribe({
      next: (p: any) => {
        console.log('DEBUG /api/users response:', p);

        // Actualización de estado FORZADA dentro de la zone
        this.ngZone.run(() => {
          if (p && Array.isArray(p.content)) {
            this.users = p.content as UserDTO[];
          } else if (Array.isArray(p)) {
            this.users = p as UserDTO[];
          } else {
            this.users = p?.content ?? p?.data ?? [];
          }
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading users', err);

        this.ngZone.run(() => {
          this.loading = false;
          if (this.toast && typeof this.toast.show === 'function') {
            this.toast.show('Error cargando usuarios', 'error');
          }
        });
      }
    });
  }

  create(): void { this.router.navigate(['/users/create']); }
  edit(u: UserDTO): void { this.router.navigate(['/users/edit', u.id]); }

  remove(u: UserDTO): void {
    if (!confirm(`Eliminar usuario ${u.username}?`)) return;
    this.userService.delete(u.id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          if (this.toast && typeof this.toast.show === 'function') {
            this.toast.show('Usuario eliminado', 'success');
          }
          this.load();
        });
      },
      error: (err: any) => {
        console.error('Error deleting user', err);
        this.ngZone.run(() => {
          if (this.toast && typeof this.toast.show === 'function') {
            this.toast.show('Error al eliminar usuario', 'error');
          }
        });
      }
    });
  }
}
