import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu';
import { Menu } from '../../../models/menu.model';

@Component({
  standalone: true,
  selector: 'app-menu-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-list.html',
  styleUrls: ['./menu-list.css'],
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  loading = true;

  constructor(
    private menuSrv: MenuService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.cdr.detectChanges();
    this.menuSrv.getAllMenus().subscribe({
      next: (menus) => {
        this.menus = menus;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading menus:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  remove(id: number) {
    if (!confirm('¿Eliminar este menú?')) return;

    this.menuSrv.deleteMenu(id).subscribe({
      next: () => {
        this.load(); // Recargar lista
      },
      error: (err) => {
        console.error('Error deleting menu:', err);
        alert('Error al eliminar el menú');
      }
    });
  }
}
