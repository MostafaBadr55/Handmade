import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { appRoutes } from './app.routes';
import { API_BASE_URL } from './core/api/api.tokens';
import { authTokenInterceptor } from './core/api/auth-token.interceptor';
import { authErrorInterceptor } from './core/api/auth-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),

    provideHttpClient(withInterceptors([authTokenInterceptor, authErrorInterceptor])),

    // Use empty base so services that append `/api/...` produce `/api/...` and
    // the dev server proxy (proxy.conf.json) can forward requests to backend.
    { provide: API_BASE_URL, useValue: '' }
  ]
};
