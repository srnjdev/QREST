import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptor } from './core/token.interceptor'; // ruta relativa

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // Registrar HttpClient + interceptor
    provideHttpClient(
      withInterceptors([ tokenInterceptor ])
      
    )
    
  ]
};
