import { Routes } from '@angular/router';
import { ListeMouvementsComponent } from './liste-mouvements/liste-mouvements.component';
import { LoginComponent } from './login/login.component';
import { DemandeMouvementComponent } from './demande-mouvement/demande-mouvement.component';
import { ValidationMouvementsComponent } from './validation-mouvements/validation-mouvements.component';
import { PlanningMouvementsComponent } from './planning-mouvements/planning-mouvements.component';
import { GestionUtilisateursComponent } from './gestion-utilisateurs/gestion-utilisateurs.component';
import { GestionLieuxComponent } from './gestion-lieux/gestion-lieux.component';
import { GestionVehiculesComponent } from './gestion-vehicules/gestion-vehicules.component';
import { GestionChauffeursComponent } from './gestion-chauffeurs/gestion-chauffeurs.component';
import { ConsolidationMouvementsComponent } from './consolidation-mouvements/consolidation-mouvements.component';
import { ModifierMouvementComponent } from './modifier-mouvement/modifier-mouvement.component';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';
import { LogbookDashboardComponent } from './logbook-dashboard/logbook-dashboard.component';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'planning',
    pathMatch: 'full'
  },
  {
    path: 'mes-mouvements',
    component: ListeMouvementsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'demande-mouvement',
    component: DemandeMouvementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'valider-mouvements',
    component: ValidationMouvementsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'planning',
    component: PlanningMouvementsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion-utilisateurs',
    component: GestionUtilisateursComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin'] }
  },
  {
    path: 'gestion-lieux',
    component: GestionLieuxComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-vehicules',
    component: GestionVehiculesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-chauffeurs',
    component: GestionChauffeursComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'consolidation',
    component: ConsolidationMouvementsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'modifier-mouvement/:id',
    component: ModifierMouvementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'tableau-bord',
    component: TableauBordComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'recap-flotte',
    loadComponent: () => import('./gestion-vehicules/fleet-recap/fleet-recap').then(m => m.FleetRecapComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-vehicules/new',
    loadComponent: () => import('./gestion-vehicules/vehicle-form/vehicle-form').then(m => m.VehicleFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-vehicules/edit/:id',
    loadComponent: () => import('./gestion-vehicules/vehicle-form/vehicle-form').then(m => m.VehicleFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'rapports-mensuels',
    loadComponent: () => import('./gestion-vehicules/monthly-report/monthly-report').then(m => m.MonthlyReportComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'admin/pays-bases',
    loadComponent: () => import('./gestion-utilisateurs/admin-pays-bases/admin-pays-bases').then(m => m.AdminPaysBasesComponent),
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'SuperAdmin'] } // Admin et SuperAdmin peuvent configurer les Pays
  },
  {
    path: 'gestion-projets',
    loadComponent: () => import('./gestion-projets/gestion-projets.component').then(m => m.GestionProjetsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin'] }
  },
  {
    path: 'user-guide',
    loadComponent: () => import('./user-guide/user-guide').then(m => m.UserGuideComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'guide-utilisateur',
    loadComponent: () => import('./guide-utilisateur/guide-utilisateur.component').then(m => m.GuideUtilisateurComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-pays',
    loadComponent: () => import('./gestion-pays/gestion-pays.component').then(m => m.GestionPaysComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin'] }
  },
  {
    path: 'logbook',
    component: LogbookDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  { path: '**', redirectTo: 'login' }
];
