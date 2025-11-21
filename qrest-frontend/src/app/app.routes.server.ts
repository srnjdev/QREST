import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client
  },
  {
    path: 'login',
    renderMode: RenderMode.Client
  },
  {
    path: 'platillos',
    renderMode: RenderMode.Client
  },
  {
    path: 'platillos/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'platillos/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'menus',
    renderMode: RenderMode.Client
  },
  {
    path: 'menus/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'menus/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'public-menu/:qrCode',
    renderMode: RenderMode.Client
  }
];
