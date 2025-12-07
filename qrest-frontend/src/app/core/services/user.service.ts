import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO, UserCreateDTO, UserUpdateDTO, Page } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  list(page = 0, size = 10, sort = 'id'): Observable<Page<UserDTO>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', sort);
    return this.http.get<Page<UserDTO>>(this.base, { params });
  }

  get(id: number) {
    return this.http.get<UserDTO>(`${this.base}/${id}`);
  }

  create(payload: UserCreateDTO) {
    return this.http.post<UserDTO>(this.base, payload);
  }

  update(id: number, payload: UserUpdateDTO) {
    return this.http.put<UserDTO>(`${this.base}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
