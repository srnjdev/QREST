import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Menu } from '../../models/menu.model';
import { DishService } from './dish';
import { load, save } from './storage.util';

const STORAGE_KEY = 'qrest_menus';
const ID_KEY = 'qrest_menus_lastId';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private menus$ = new BehaviorSubject<Menu[]>(load<Menu[]>(STORAGE_KEY, []));
  private lastId = load<number>(ID_KEY, 0);

  constructor(private dishSrv: DishService) {}

  private persist() {
    save(STORAGE_KEY, this.menus$.value);
    save(ID_KEY, this.lastId);
  }

  list(): Observable<Menu[]> {
    return this.menus$.asObservable();
  }

  get(id: number): Observable<Menu> {
    const found = this.menus$.value.find(m => m.id === id)!;
    return of(found);
  }

  // payload: { nombre, platillosIds }
  create(payload: { nombre: string; platillosIds: number[] }) {
    const newMenu: Menu = { id: ++this.lastId, nombre: payload.nombre, platillos: [] };
    // resolvemos platillos por id en el momento de mostrar (o aquí si prefieres)
    (newMenu as any).platillosIds = payload.platillosIds;
    const next = [...this.menus$.value, newMenu];
    this.menus$.next(next);
    this.persist();
    return newMenu;
  }

  update(id: number, payload: { nombre: string; platillosIds: number[] }) {
    const next = this.menus$.value.map(m =>
      m.id === id ? { ...m, nombre: payload.nombre, platillos: [], platillosIds: payload.platillosIds } as any : m
    );
    this.menus$.next(next);
    this.persist();
  }

  delete(id: number) {
    const next = this.menus$.value.filter(m => m.id !== id);
    this.menus$.next(next);
    this.persist();
  }
}
