import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Dish } from '../../models/dish.model';
import { load, save } from './storage.util';

const STORAGE_KEY = 'qrest_dishes';
const ID_KEY = 'qrest_dishes_lastId';

@Injectable({ providedIn: 'root' })
export class DishService {
  private dishes$ = new BehaviorSubject<Dish[]>(load<Dish[]>(STORAGE_KEY, []));
  private lastId = load<number>(ID_KEY, 0);

  constructor() {
    // ✅ Semilla inicial de platillos (solo la primera vez)
    if (this.dishes$.value.length === 0) {
      this.dishes$.next([
        { id: ++this.lastId, nombre: 'Hamburguesa', descripcion: 'Clásica', precio: 6.99 },
        { id: ++this.lastId, nombre: 'Pizza Margarita', descripcion: 'Con albahaca', precio: 9.50 },
      ]);
      this.persist();
    }
  }

  private persist() {
    save(STORAGE_KEY, this.dishes$.value);
    save(ID_KEY, this.lastId);
  }

  list(): Observable<Dish[]> {
    return this.dishes$.asObservable();
  }

  get(id: number): Observable<Dish> {
    const found = this.dishes$.value.find(d => d.id === id)!;
    return of(found);
  }

  async createFromForm(form: { nombre: string; descripcion?: string; precio: number }, file?: File) {
    const imagenUrl = file ? await this.toDataUrl(file) : undefined;
    const newDish: Dish = { id: ++this.lastId, ...form, imagenUrl };
    const next = [...this.dishes$.value, newDish];
    this.dishes$.next(next);
    this.persist();
    return newDish;
  }

  async updateFromForm(id: number, form: { nombre: string; descripcion?: string; precio: number }, file?: File) {
    const current = this.dishes$.value.find(d => d.id === id);
    if (!current) return;
    const imagenUrl = file ? await this.toDataUrl(file) : current.imagenUrl;
    const updated: Dish = { ...current, ...form, imagenUrl };
    const next = this.dishes$.value.map(d => (d.id === id ? updated : d));
    this.dishes$.next(next);
    this.persist();
    return updated;
  }

  delete(id: number) {
    const next = this.dishes$.value.filter(d => d.id !== id);
    this.dishes$.next(next);
    this.persist();
  }

  private toDataUrl(file: File): Promise<string> {
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result as string);
      fr.readAsDataURL(file);
    });
  }
}
