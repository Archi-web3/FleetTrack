import { Routes } from '@angular/router';
import { ListeMouvementsComponent } from './features/liste-mouvements/liste-mouvements.component';
import { LoginComponent } from './features/login/login.component';
import { DemandeMouvementComponent } from './features/demande-mouvement/demande-mouvement.component';
import { ValidationMouvementsComponent } from './features/validation-mouvements/validation-mouvements.component';
import { PlanningMouvementsComponent } from './features/planning-mouvements/planning-mouvements.component';
import { GestionUtilisateursComponent } from './features/gestion-utilisateurs/gestion-utilisateurs.component';
import { GestionLieuxComponent } from './features/gestion-lieux/gestion-lieux.component';
import { GestionVehiculesComponent } from './features/gestion-vehicules/gestion-vehicules.component';
import { GestionChauffeursComponent } from './features/gestion-chauffeurs/gestion-chauffeurs.component';
import { ConsolidationMouvementsComponent } from './features/consolidation-mouvements/consolidation-mouvements.component';
import { ModifierMouvementComponent } from './features/modifier-mouvement/modifier-mouvement.component';
import { TableauBordComponent } from './features/tableau-bord/tableau-bord.component';
import { LogbookDashboardComponent } from './features/logbook-dashboard/logbook-dashboard.component';
import { StatisticsComponent } from './features/statistics/statistics.component';
import { MaintenanceTrackingComponent } from './features/maintenance-tracking/maintenance-tracking.component';
import { AuthGuard } from './auth-guard';

import { MapComponent } from './features/map/map';
import { HomeDashboardComponent } from './features/home-dashboard/home-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: HomeDashboardComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mes-mouvements',
    component: ListeMouvementsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'security-alerts',
    loadComponent: () => import('./features/security-alerts/security-alerts.component').then(m => m.SecurityAlertsComponent),
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile/profile').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'demande-mouvement',
    component: DemandeMouvementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'valider-mouvements',
    component: ValidationMouvementsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermission: { module: 'mouvements_workflow', action: 'view_menu' }, roles: ['SuperAdmin', 'Admin', 'Superviseur', 'Superviseur Sécurité'] }
  },
  {
    path: 'planning',
    component: PlanningMouvementsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'suivi-maintenance',
    component: MaintenanceTrackingComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-utilisateurs',
    component: GestionUtilisateursComponent,
    canActivate: [AuthGuard],
    data: { requiredPermission: { module: 'admin_users', action: 'view_menu' }, roles: ['SuperAdmin', 'Admin'] }
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
    data: { requiredPermission: { module: 'flotte_vehicules', action: 'view_menu' }, roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
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
    loadComponent: () => import('./features/gestion-vehicules/fleet-recap/fleet-recap').then(m => m.FleetRecapComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-vehicules/new',
    loadComponent: () => import('./features/gestion-vehicules/vehicle-form/vehicle-form').then(m => m.VehicleFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-vehicules/edit/:id',
    loadComponent: () => import('./features/gestion-vehicules/vehicle-form/vehicle-form').then(m => m.VehicleFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'rapports-mensuels',
    loadComponent: () => import('./features/gestion-vehicules/monthly-report/monthly-report').then(m => m.MonthlyReportComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'admin/pays-bases',
    loadComponent: () => import('./features/gestion-utilisateurs/admin-pays-bases/admin-pays-bases').then(m => m.AdminPaysBasesComponent),
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'SuperAdmin'] } // Admin et SuperAdmin peuvent configurer les Pays
  },
  {
    path: 'gestion-projets',
    loadComponent: () => import('./features/gestion-projets/gestion-projets.component').then(m => m.GestionProjetsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin'] }
  },
  {
    path: 'admin/audit-logs',
    loadComponent: () => import('./features/audit-log/audit-log').then(m => m.AuditLogComponent),
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'SuperAdmin', 'Superviseur'] }
  },
  {
    path: 'admin/waivers',
    loadComponent: () => import('./features/waiver-list/waiver-list').then(m => m.WaiverListComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'user-guide',
    loadComponent: () => import('./features/user-guide/user-guide').then(m => m.UserGuideComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'guide-utilisateur',
    loadComponent: () => import('./features/user-guide/user-guide').then(m => m.UserGuideComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-pays',
    loadComponent: () => import('./features/gestion-pays/gestion-pays.component').then(m => m.GestionPaysComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin'] }
  },
  {
    path: 'vehicle-profile/:id',
    loadComponent: () => import('./features/gestion-vehicules/vehicle-profile/vehicle-profile').then(m => m.VehicleProfileComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'gestion-maintenance',
    loadComponent: () => import('./features/gestion-maintenance/maintenance-dashboard/maintenance-dashboard').then(m => m.MaintenanceDashboardComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'admin/workflow',
    loadComponent: () => import('./features/workflow-dashboard/workflow-dashboard').then(m => m.WorkflowDashboardComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin'] }
  },
  {
    path: 'admin/settings',
    loadComponent: () => import('./features/general-settings/general-settings').then(m => m.GeneralSettingsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin'] }
  },
  {
    path: 'gestion-maintenance/config',
    loadComponent: () => import('./features/gestion-maintenance/service-config/service-config').then(m => m.ServiceConfigComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin'] }
  },
  {
    path: 'gestion-maintenance/templates',
    loadComponent: () => import('./features/gestion-maintenance/template-manager/template-manager').then(m => m.TemplateManagerComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin'] }
  },
  {
    path: 'logbook',
    component: LogbookDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./features/roadmap/roadmap').then(m => m.RoadmapComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/security-matrix',
    loadComponent: () => import('./features/security-matrix/security-matrix.component').then(m => m.SecurityMatrixComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur Sécurité'] }
  },
  {
    path: 'admin/profile-matrix',
    loadComponent: () => import('./features/admin-profile-matrix/admin-profile-matrix').then(m => m.AdminProfileMatrixComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin'] }
  },
  {
    path: 'environment-roadmap',
    loadComponent: () => import('./features/environment-roadmap/environment-roadmap').then(m => m.EnvironmentRoadmapComponent),
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Superviseur'] }
  },
  { path: '**', redirectTo: 'login' }
];
