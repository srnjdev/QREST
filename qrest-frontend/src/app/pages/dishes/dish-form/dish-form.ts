import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DishService } from '../../../core/services/dish';
import { Dish } from '../../../models/dish.model';

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
  form: Dish = { nombre: '', descripcion: '', precio: 0 };
  file?: File;
  previewUrl?: string;

  constructor(private route: ActivatedRoute, private router: Router, private dishSrv: DishService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    if (idParam) {
      this.id = +idParam;
      this.dishSrv.get(this.id).subscribe(d => {
        this.form = d;
        this.previewUrl = d.imagenUrl;
      });
    }
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      this.previewUrl = URL.createObjectURL(this.file);
    }
  }

save() {
  const dto = { nombre: this.form.nombre, descripcion: this.form.descripcion, precio: this.form.precio };
  const req = this.isEdit && this.id
    ? this.dishSrv.updateFromForm(this.id, dto, this.file)
    : this.dishSrv.createFromForm(dto, this.file);

  Promise.resolve(req).then(() => this.router.navigate(['/platillos']));
}

}
