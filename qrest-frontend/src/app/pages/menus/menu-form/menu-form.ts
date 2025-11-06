import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu';
import { DishService } from '../../../core/services/dish';
import { Dish } from '../../../models/dish.model';
import { Menu } from '../../../models/menu.model';

@Component({
  standalone: true,
  selector: 'app-menu-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-form.html',
  styleUrls: ['./menu-form.css'],
})
export class MenuFormComponent implements OnInit {
  isEdit = false;
  id?: number;

  name = '';
  description = '';
  allDishes: Dish[] = [];
  selectedIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuSrv: MenuService,
    private dishSrv: DishService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    if (idParam) this.id = +idParam;

    // Cargar todos los platos
    this.dishSrv.getAllDishes().subscribe({
      next: (dishes) => {
        this.allDishes = dishes;
        this.cdr.detectChanges();

        // Si es edición, cargar el menú
        if (this.isEdit && this.id) {
          this.menuSrv.getMenuById(this.id).subscribe({
            next: (menu) => {
              this.name = menu.name;
              this.description = menu.description || '';

              // Marcar platos seleccionados
              if (menu.dishes) {
                for (const dish of menu.dishes) {
                  if (dish.id) this.selectedIds.add(dish.id);
                }
              }
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error loading menu:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error loading dishes:', err);
      }
    });
  }

  toggle(id: number) {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  save() {
    const menuData: Menu = {
      name: this.name,
      description: this.description,
      restaurantId: 1, // Por ahora usamos el restaurante demo
      qrCode: '', // Se genera automáticamente en el backend
      active: true
    };

    if (this.isEdit && this.id) {
      // Actualizar menú
      this.menuSrv.updateMenu(this.id, menuData).subscribe({
        next: (menu) => {
          // Actualizar platos del menú
          this.updateMenuDishes(menu.id!);
        },
        error: (err) => console.error('Error updating menu:', err)
      });
    } else {
      // Crear nuevo menú
      this.menuSrv.createMenu(menuData).subscribe({
        next: (menu) => {
          // Agregar platos al menú
          this.updateMenuDishes(menu.id!);
        },
        error: (err) => console.error('Error creating menu:', err)
      });
    }
  }

  private updateMenuDishes(menuId: number) {
    // Por simplicidad, asumimos que queremos reemplazar todos los platos
    // En una implementación real, harías un diff y solo agregarías/quitarías los necesarios
    const selectedDishIds = Array.from(this.selectedIds);

    if (selectedDishIds.length > 0) {
      // Agregar cada plato al menú
      let completed = 0;
      selectedDishIds.forEach(dishId => {
        this.menuSrv.addDishToMenu(menuId, dishId).subscribe({
          next: () => {
            completed++;
            if (completed === selectedDishIds.length) {
              this.router.navigate(['/menus']);
            }
          },
          error: (err) => console.error('Error adding dish:', err)
        });
      });
    } else {
      this.router.navigate(['/menus']);
    }
  }
}
