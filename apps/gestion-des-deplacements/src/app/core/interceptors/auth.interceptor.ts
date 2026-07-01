import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip third-party external APIs
  if (req.url.includes('router.project-osrm.org') || req.url.includes('api.open-meteo.com')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    const selectedCountry = localStorage.getItem('selectedCountry');
    const headers: Record<string, string> = {
      'x-auth-token': token,
      'Authorization': `Bearer ${token}`
    };

    if (selectedCountry) {
      headers['X-Selected-Country'] = selectedCountry;
    }

    const cloned = req.clone({ setHeaders: headers });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
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
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
};
