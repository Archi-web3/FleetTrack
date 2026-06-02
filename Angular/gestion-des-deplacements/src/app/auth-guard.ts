import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service'; // Assurez-vous d'importer le bon nom de fichier (auth.service ou auth)

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

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

        // Récupérer les rôles attendus pour cette route (définis dans app.routes.ts)
        const expectedRoles = route.data['roles'] as string[];

        if (expectedRoles && expectedRoles.length > 0) {
          const userProfile = this.authService.getUserProfile(); // Obtenir le profil de l'utilisateur
          if (!userProfile || !expectedRoles.includes(userProfile)) {
            // L'utilisateur est authentifié mais n'a pas le rôle requis
            alert('Accès refusé. Vous n\'avez pas les permissions pour accéder à cette page.');
            return this.router.createUrlTree(['/']); // Rediriger vers l'accueil
          }
        }
        return true; // L'utilisateur est authentifié et a le rôle requis (si applicable)
      })
    );
  }
}
