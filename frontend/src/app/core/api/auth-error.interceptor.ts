import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthTokenService } from './auth-token.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(AuthTokenService);

  return next(req).pipe(
    catchError((err) => {
      const status = err?.status ?? 0;
      if (status === 401 || status === 403) {
        try {
          tokenService.setToken(null);
          tokenService.setUserName(null);
        } catch {}

        const nextUrl = window?.location ? `${window.location.pathname}${window.location.search}` : '/';
        router.navigate(['/login'], { queryParams: { next: nextUrl } });
      }
      return throwError(() => err);
    })
  );
};
