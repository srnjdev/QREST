import { Component, OnInit } from '@angular/core';
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

  nombre = '';
  allDishes: Dish[] = [];
  selectedIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuSrv: MenuService,
    private dishSrv: DishService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    if (idParam) this.id = +idParam;

    this.dishSrv.list().subscribe(ds => {
      this.allDishes = ds;
      if (this.isEdit && this.id) {
        this.menuSrv.get(this.id).subscribe((m: Menu) => {
          this.nombre = m.nombre;
          for (const d of m.platillos || []) {
            if (d.id) this.selectedIds.add(d.id);
          }
        });
      }
    });
  }

  toggle(id: number) {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  save() {
  const payload = { nombre: this.nombre, platillosIds: Array.from(this.selectedIds) };

  if (this.isEdit && this.id) {
    this.menuSrv.update(this.id, payload);   // devuelve void (no .subscribe)
  } else {
    this.menuSrv.create(payload);            // devuelve Menu (tampoco necesitas .subscribe)
  }

  this.router.navigate(['/menus']);
}
}
