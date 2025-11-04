import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu';
import { DishService } from '../../../core/services/dish';
import { Menu } from '../../../models/menu.model';
import { Dish } from '../../../models/dish.model';

@Component({
  standalone: true,
  selector: 'app-menu-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-list.html',
  styleUrls: ['./menu-list.css'],
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];

  constructor(
    private menuSrv: MenuService,
    private dishSrv: DishService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    // 🔽 Cargamos los menús desde el servicio en memoria
    this.menuSrv.list().subscribe(menus => {
      this.menus = menus.map(m => {
        const ids = (m as any).platillosIds as number[] | undefined;
        if (!ids?.length) return m;

        // 🔽 Nos suscribimos una sola vez a los platillos disponibles
        this.dishSrv.list().subscribe(ds => {
          // Vinculamos los objetos de platillos por ID
          m.platillos = ds.filter(d => ids.includes(d.id!));
        });

        return m;
      });
    });
  }

  remove(id: number) {
    if (!confirm('¿Eliminar este menú?')) return;
    this.menuSrv.delete(id);
  }
}
