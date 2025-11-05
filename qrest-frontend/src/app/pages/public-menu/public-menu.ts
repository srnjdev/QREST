import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../core/services/menu';
import { DishService } from '../../core/services/dish';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-public-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-menu.html',
  styleUrls: ['./public-menu.css'],
})
export class PublicMenuComponent implements OnInit {
  nombre = '';
  platos: Dish[] = [];

  constructor(
    private route: ActivatedRoute,
    private menuSrv: MenuService,
    private dishSrv: DishService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.menuSrv.get(id).subscribe(m => {
      this.nombre = m.nombre;
      const ids = (m as any).platillosIds as number[] | undefined;
      if (!ids?.length) { this.platos = []; return; }
      this.dishSrv.list().subscribe(ds => this.platos = ds.filter(d => ids.includes(d.id!)));
    });
  }
}
