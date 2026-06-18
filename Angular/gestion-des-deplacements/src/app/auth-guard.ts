import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './core/services/auth.service';
import { PermissionsService } from './core/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private permissionsService: PermissionsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          // L'utilisateur n'est pas authentifié, rediriger vers la page de connexion
          return this.router.createUrlTree(['/login']);
        }

        // Vérification par Permission Dynamique
        const requiredPermission = route.data['requiredPermission'];
        if (requiredPermission) {
          const { module, action } = requiredPermission;
          if (!this.permissionsService.hasPermission(module, action)) {
            alert('Accès refusé. Vous n\'avez pas la permission requise.');
            return this.router.createUrlTree(['/']);
          }
          return true;
        }

        // Fallback: Récupérer les rôles attendus (ancienne méthode)
        const expectedRoles = route.data['roles'] as string[];
        if (expectedRoles && expectedRoles.length > 0) {
          const userProfile = this.authService.getUserProfile();
          if (!userProfile || !expectedRoles.includes(userProfile)) {
            // L'utilisateur est authentifié mais n'a pas le rôle requis
            alert('Accès refusé. Vous n\'avez pas les permissions pour accéder à cette page.');
            return this.router.createUrlTree(['/']);
          }
        }
        
        return true; 
      })
    );
  }
}
