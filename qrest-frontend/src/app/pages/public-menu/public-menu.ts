import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../core/services/menu';
import { Menu } from '../../models/menu.model';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-public-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-menu.html',
  styleUrls: ['./public-menu.css'],
})
export class PublicMenuComponent implements OnInit {
  menu: Menu | null = null;
  dishes: Dish[] = [];
  loading = true;
  error = '';

  // Agrupar platos por categoría
  dishesByCategory: { [key: string]: Dish[] } = {};

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const qrCode = this.route.snapshot.paramMap.get('qrCode');
    if (qrCode) {
      this.loadMenu(qrCode);
    } else {
      this.error = 'Código QR no válido';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private loadMenu(qrCode: string): void {
    this.menuService.getMenuByQrCode(qrCode).subscribe({
      next: (menu) => {
        this.menu = menu;
        this.dishes = menu.dishes || [];
        this.groupDishesByCategory();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading menu:', err);
        this.error = 'No se pudo cargar el menú. Verifica el código QR.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private groupDishesByCategory(): void {
    this.dishesByCategory = {};
    this.dishes.forEach(dish => {
      const categoryName = dish.categoryName || 'Sin categoría';
      if (!this.dishesByCategory[categoryName]) {
        this.dishesByCategory[categoryName] = [];
      }
      this.dishesByCategory[categoryName].push(dish);
    });
  }

  get categories(): string[] {
    return Object.keys(this.dishesByCategory);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}

