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
        const clonedReq = req.clone({
            setHeaders: {
                'x-auth-token': token
            }
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
                const authService = inject(AuthService); // Ré-injection nécessaire ici si on passe par ce chemin
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};
