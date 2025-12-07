import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../models/menu.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = `${environment.apiUrl}/api/menus`;
  /*private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('admin:admin123'),
    'Content-Type': 'application/json'
  });*/

  constructor(private http: HttpClient) { }

  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  getMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`);
  }

  getMenuByQrCode(qrCode: string): Observable<Menu> {
    // Este endpoint NO requiere autenticación (público)
    return this.http.get<Menu>(`${this.apiUrl}/qr/${qrCode}`);
  }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu);
  }

  updateMenu(id: number, menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu);
  }

  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addDishToMenu(menuId: number, dishId: number): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/${menuId}/dishes/${dishId}`, {});
  }

  removeDishFromMenu(menuId: number, dishId: number): Observable<Menu> {
    return this.http.delete<Menu>(`${this.apiUrl}/${menuId}/dishes/${dishId}`);
  }
}

