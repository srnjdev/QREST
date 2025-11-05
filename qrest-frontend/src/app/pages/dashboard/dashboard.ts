import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DishService } from '../../core/services/dish';
import { MenuService } from '../../core/services/menu';
import { Dish } from '../../models/dish.model';
import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  dishes: Dish[] = [];
  menus: Menu[] = [];

  constructor(
    private dishSrv: DishService,
    private menuSrv: MenuService
  ) {}

  ngOnInit(): void {
    // suscribimos a los datos almacenados en memoria
    this.dishSrv.list().subscribe(ds => this.dishes = ds);
    this.menuSrv.list().subscribe(ms => this.menus = ms);
  }

  // cantidad de platillos registrados
  get dishCount() { return this.dishes.length; }

  // cantidad de menús creados
  get menuCount() { return this.menus.length; }

  // últimos 3 platillos
  get recentDishes() { return [...this.dishes].reverse().slice(0, 3); }

  // últimos 3 menús
  get recentMenus() { return [...this.menus].reverse().slice(0, 3); }

  // método helper para mostrar cantidad de platillos por menú
  getPlatillosCount(menu: Menu): number {
    // Si el menú tiene una lista de IDs (cuando viene de localStorage)
    const idsCount = (menu as any)['platillosIds']?.length ?? 0;
    // Si el menú tiene objetos de platillos (cuando ya está cargado)
    const platosCount = menu.platillos?.length ?? 0;
    // Devolver el que tenga datos (preferencia IDs)
    return idsCount || platosCount || 0;
  }
}
