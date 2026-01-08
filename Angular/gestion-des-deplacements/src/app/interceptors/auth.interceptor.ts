import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Injecter AuthService pour récupérer le token
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                'x-auth-token': token
            }
        });
        return next(clonedReq);
    }

    return next(req);
};
