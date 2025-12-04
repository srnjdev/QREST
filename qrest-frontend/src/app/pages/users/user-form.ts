// src/app/pages/users/user-form.ts
import { ChangeDetectorRef, Component, NgZone,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { UserCreateDTO, UserUpdateDTO, UserDTO } from '../../models/user.model';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-form.html'
})
export class UserFormComponent {
  mode: 'create' | 'edit' = 'create';
  id?: number;

  model: any = {
    username: '',
    password: '',
    roles: ['ROLE_USER'],
    rolesString: 'ROLE_USER',
    active: true
  };

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toast: ToastService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // Nos suscribimos a cambios en params para cubrir navegaciones internas
    this.route.params.subscribe(params => {
      const paramId = params['id'];
      if (paramId) {
        this.mode = 'edit';
        this.id = Number(paramId);
        this.load(); // carga el usuario si existe id
      } else {
        this.mode = 'create';
        this.id = undefined;
        // reset modelo
        this.resetModel();
      }
    });
  }

  private resetModel(): void {
    this.model = {
      username: '',
      password: '',
      roles: ['ROLE_USER'],
      rolesString: 'ROLE_USER',
      active: true
    };
  }

  load(): void {
    if (!this.id) return;
    this.loading = true;
    this.userService.get(this.id).subscribe({
      next: (u: UserDTO) => {
        // Forzamos la actualización en la zone para que la UI renderice inmediatamente
        this.ngZone.run(() => {
          // asignaciones defensivas
          this.model.username = u?.username ?? '';
          this.model.roles = Array.isArray(u?.roles) ? u.roles : [];
          this.model.rolesString = (this.model.roles || []).join(',');
          // si tu DTO tiene active, úsalo; si no, mantener true por defecto
          this.model.active = typeof u?.active === 'boolean' ? u.active : true;
          this.model.password = ''; // no mostramos password
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando usuario', err);
        this.ngZone.run(() => {
          this.loading = false;
          this.toast?.show?.('Error cargando usuario', 'error');
        });
      }
    });
  }

  // Método invocado desde template (ngModelChange) para mantener roles en sync
  onRolesChange(value: string): void {
    const rolesArray = (value || '')
      .split(',')
      .map(s => s.trim())
      .filter((s: string) => s.length > 0);
    this.model.roles = rolesArray;
  }

  submit(): void {
    this.loading = true;
    // aseguramos model.roles actualizado
    this.model.roles = (this.model.rolesString || '').split(',').map((s: string) => s.trim()).filter(Boolean);

    if (this.mode === 'create') {
      const payload: UserCreateDTO = {
        username: this.model.username,
        password: this.model.password,
        roles: this.model.roles,
        active: this.model.active
      };

      this.userService.create(payload).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.toast?.show?.('Usuario creado', 'success');
            this.router.navigateByUrl('/users');
          });
        },
        error: (err: any) => {
          console.error('Error creando usuario', err);
          this.ngZone.run(() => {
            this.loading = false;
            this.toast?.show?.(err?.error?.message || 'Error creando usuario', 'error');
          });
        }
      });
    } else {
      const payload: UserUpdateDTO = {
        username: this.model.username,
        password: this.model.password || undefined,
        roles: this.model.roles,
        active: this.model.active
      };

      this.userService.update(this.id!, payload).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.toast?.show?.('Usuario actualizado', 'success');
            this.router.navigateByUrl('/users');
          });
        },
        error: (err: any) => {
          console.error('Error actualizando usuario', err);
          this.ngZone.run(() => {
            this.loading = false;
            this.toast?.show?.(err?.error?.message || 'Error actualizando usuario', 'error');
          });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/users');
  }
}
