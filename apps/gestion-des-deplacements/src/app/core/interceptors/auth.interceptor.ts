import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { PaysService } from '../services/pays.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip third-party external APIs
  if (req.url.includes('router.project-osrm.org') || req.url.includes('api.open-meteo.com')) {
    return next(req);
  }

  const token = localStorage.getItem('jwtToken');
  const paysService = inject(PaysService);

  if (token) {
    const selectedCountry = paysService.getSelectedCountry();
    const selectedBase = localStorage.getItem('selectedBase');

    // Add required headers for all API requests
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-auth-token': token,
      'Authorization': `Bearer ${token}`
    };

    if (selectedCountry) {
      headers['X-Selected-Country'] = selectedCountry;
    }
    if (selectedBase) {
      headers['X-Selected-Base'] = selectedBase;
    }

    const cloned = req.clone({ setHeaders: headers });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('userProfile');
          window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userProfile');
        window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
};
