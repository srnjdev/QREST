import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PublicMenuComponent } from './pages/public-menu/public-menu';

import { DishListComponent } from './pages/dishes/dish-list/dish-list';
import { DishFormComponent } from './pages/dishes/dish-form/dish-form';
import { MenuListComponent } from './pages/menus/menu-list/menu-list';
import { MenuFormComponent } from './pages/menus/menu-form/menu-form';
import { TestComponent } from './pages/test/test';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent },

  // Página de prueba
  { path: 'test', component: TestComponent },

  // Platillos
  { path: 'platillos', component: DishListComponent },
  { path: 'platillos/crear', component: DishFormComponent },
  { path: 'platillos/editar/:id', component: DishFormComponent },

  // Menús
  { path: 'menus', component: MenuListComponent },
  { path: 'menus/crear', component: MenuFormComponent },
  { path: 'menus/editar/:id', component: MenuFormComponent },

  // Público (QR) - usa qrCode como parámetro
  { path: 'public-menu/:qrCode', component: PublicMenuComponent },

  { path: '**', redirectTo: '' },
];

