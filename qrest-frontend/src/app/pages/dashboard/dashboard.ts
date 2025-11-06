import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  loading = false;
  error: string | null = null;

  constructor(
    private dishSrv: DishService,
    private menuSrv: MenuService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    // Load dishes and menus from API
    this.dishSrv.getAllDishes().subscribe({
      next: (ds: Dish[]) => {
        this.dishes = ds;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dishes:', error);
        this.error = `Error al cargar platillos: ${error.message || 'Error desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.menuSrv.getAllMenus().subscribe({
      next: (ms: Menu[]) => {
        this.menus = ms;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading menus:', error);
        if (!this.error) {
          this.error = `Error al cargar menús: ${error.message || 'Error desconocido'}`;
        }
        this.cdr.detectChanges();
      }
    });
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
  getDishesCount(menu: Menu): number {
    return menu.dishes?.length ?? 0;
  }
}
