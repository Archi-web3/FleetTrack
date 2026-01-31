import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip external APIs (OSRM, etc.)
    if (req.url.includes('router.project-osrm.org')) {
        return next(req);
    }

    // Injecter AuthService pour récupérer le token
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const selectedCountry = localStorage.getItem('selectedCountry');
        const headers: any = {
            'x-auth-token': token
        };

        if (selectedCountry) {
            headers['X-Selected-Country'] = selectedCountry;
        }

        const clonedReq = req.clone({
            setHeaders: headers
        });
        return next(clonedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    console.warn('[AuthInterceptor] 401 Unauthorized détecté. Déconnexion forcée.');
                    // On doit utiliser inject(AuthService) ici car c'est une fonction
                    authService.logout();
                }
                return throwError(() => error);
            })
        );
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('[AuthInterceptor] 401 Unauthorized détecté (sans token). Déconnexion forcée.');
                // Fix: Utiliser l'instance authService déjà injectée plus haut, ne pas rappeler inject() ici
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};
