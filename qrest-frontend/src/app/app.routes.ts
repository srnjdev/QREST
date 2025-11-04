import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PublicMenuComponent } from './pages/public-menu/public-menu';

import { DishListComponent } from './pages/dishes/dish-list/dish-list';
import { DishFormComponent } from './pages/dishes/dish-form/dish-form';
import { MenuListComponent } from './pages/menus/menu-list/menu-list';
import { MenuFormComponent } from './pages/menus/menu-form/menu-form';

export const routes: Routes = [
  { path: '', component: DashboardComponent },

  // Platillos
  { path: 'platillos', component: DishListComponent },
  { path: 'platillos/crear', component: DishFormComponent },
  { path: 'platillos/editar/:id', component: DishFormComponent },

  // Menús
  { path: 'menus', component: MenuListComponent },
  { path: 'menus/crear', component: MenuFormComponent },
  { path: 'menus/editar/:id', component: MenuFormComponent },

  // Público (QR)
  { path: 'menu/:id', component: PublicMenuComponent },

  { path: '**', redirectTo: '' },
];
