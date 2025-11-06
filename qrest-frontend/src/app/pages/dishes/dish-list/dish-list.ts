import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DishService } from '../../../core/services/dish';
import { Dish } from '../../../models/dish.model';

@Component({
  standalone: true,
  selector: 'app-dish-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './dish-list.html',
  styleUrls: ['./dish-list.css'],
})
export class DishListComponent implements OnInit {
  dishes: Dish[] = [];
  loading = true;

  constructor(
    private dishSrv: DishService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.cdr.detectChanges();
    this.dishSrv.getAllDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dishes:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  remove(id: number) {
    if (!confirm('¿Eliminar este platillo?')) return;

    this.dishSrv.deleteDish(id).subscribe({
      next: () => {
        this.load(); // Recargar lista
      },
      error: (err) => {
        console.error('Error deleting dish:', err);
        alert('Error al eliminar el platillo');
      }
    });
  }
}
