import { Component, OnInit } from '@angular/core';
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

  constructor(private dishSrv: DishService) {}

  ngOnInit(): void {
    // Nos suscribimos al BehaviorSubject que emite los platillos
    this.dishSrv.list().subscribe(res => this.dishes = res);
  }

  remove(id: number) {
    if (!confirm('¿Eliminar este platillo?')) return;
    // En la versión mock, delete() no devuelve observable, solo actualiza el estado.
    this.dishSrv.delete(id);
  }
}
