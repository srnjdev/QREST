import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DishService } from '../../../core/services/dish';
import { Dish, Category } from '../../../models/dish.model';

@Component({
  standalone: true,
  selector: 'app-dish-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dish-form.html',
  styleUrls: ['./dish-form.css'],
})
export class DishFormComponent implements OnInit {
  isEdit = false;
  id?: number;
  form: Partial<Dish> = {
    name: '',
    description: '',
    price: 0,
    available: true,
    categoryId: undefined,
    imageUrl: ''
  };
  loading = false;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dishSrv: DishService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Load categories
    this.dishSrv.getAllCategories().subscribe({
      next: (cats: Category[]) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    if (idParam) {
      this.id = +idParam;
      this.loading = true;
      this.cdr.detectChanges();
      this.dishSrv.getDishById(this.id).subscribe({
        next: (d) => {
          this.form = d;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading dish:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  save() {
    this.loading = true;

    if (!this.form.categoryId) {
      alert('Por favor selecciona una categoría');
      this.loading = false;
      return;
    }

    const dish: Dish = {
      name: this.form.name || '',
      description: this.form.description || '',
      price: this.form.price || 0,
      available: this.form.available ?? true,
      active: true,
      categoryId: this.form.categoryId,
      imageUrl: this.form.imageUrl || ''
    };

    const req = this.isEdit && this.id
      ? this.dishSrv.updateDish(this.id, dish)
      : this.dishSrv.createDish(dish);

    req.subscribe({
      next: () => this.router.navigate(['/platillos']),
      error: (err: any) => {
        console.error('Error saving dish:', err);
        this.loading = false;
      }
    });
  }
}
