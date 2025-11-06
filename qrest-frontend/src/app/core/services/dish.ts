import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish, Category } from '../../models/dish.model';

@Injectable({ providedIn: 'root' })
export class DishService {
  private apiUrl = 'http://localhost:8080/api';
  private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('admin:admin123'),
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  // Dishes
  getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes`, { headers: this.headers });
  }

  getDishById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/dishes/${id}`, { headers: this.headers });
  }

  getDishesByCategory(categoryId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes/category/${categoryId}`, { headers: this.headers });
  }

  createDish(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/dishes`, dish, { headers: this.headers });
  }

  updateDish(id: number, dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/dishes/${id}`, dish, { headers: this.headers });
  }

  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dishes/${id}`, { headers: this.headers });
  }

  // Categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { headers: this.headers });
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`, { headers: this.headers });
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category, { headers: this.headers });
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category, { headers: this.headers });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`, { headers: this.headers });
  }
}

