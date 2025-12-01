import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
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
  { path: '', component: DashboardComponent, canActivate: [authGuard] },

  // Página de prueba
  { path: 'test', component: TestComponent, canActivate: [authGuard] },

  // Platillos
  { path: 'platillos', component: DishListComponent, canActivate: [authGuard] },
  { path: 'platillos/crear', component: DishFormComponent, canActivate: [authGuard] },
  { path: 'platillos/editar/:id', component: DishFormComponent, canActivate: [authGuard] },

  // Menús
  { path: 'menus', component: MenuListComponent, canActivate: [authGuard] },
  { path: 'menus/crear', component: MenuFormComponent, canActivate: [authGuard] },
  { path: 'menus/editar/:id', component: MenuFormComponent, canActivate: [authGuard] },

  // Público (QR) - usa qrCode como parámetro
  { path: 'public-menu/:qrCode', component: PublicMenuComponent },

  { path: '**', redirectTo: '' },
];

