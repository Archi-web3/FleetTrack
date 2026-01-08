import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { VehicleSelectorComponent } from './features/vehicle-selector/vehicle-selector';
import { TripListComponent } from './features/trip-list/trip-list';
import { FuelListComponent } from './features/fuel-list/fuel-list';
import { MaintenanceListComponent } from './features/maintenance-list/maintenance-list';
import { IncidentListComponent } from './features/incident-list/incident-list';
import { ActiveTripComponent } from './features/active-trip/active-trip';
import { FuelFormComponent } from './features/fuel-form/fuel-form';
import { MaintenanceFormComponent } from './features/maintenance-form/maintenance-form';
import { IncidentFormComponent } from './features/incident-form/incident-form';
import { PlanningComponent } from './features/planning/planning';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'vehicle-selector', component: VehicleSelectorComponent },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
    { path: 'trips', component: TripListComponent },
    { path: 'trip-list', redirectTo: 'trips', pathMatch: 'full' },
    { path: 'fuels', component: FuelListComponent },
    { path: 'maintenances', component: MaintenanceListComponent },
    { path: 'incidents', component: IncidentListComponent },
    { path: 'planning', component: PlanningComponent },
    { path: 'active-trip', component: ActiveTripComponent },
    { path: 'fuel-form', component: FuelFormComponent },
    { path: 'maintenance-form', component: MaintenanceFormComponent },
    { path: 'incident-form', component: IncidentFormComponent },

    // Maintenance System
    { path: 'weekly-checklist', loadComponent: () => import('./features/weekly-checklist/weekly-checklist').then(m => m.WeeklyChecklistComponent) },
    { path: 'scheduled-service', loadComponent: () => import('./features/scheduled-service/scheduled-service').then(m => m.ScheduledServiceComponent) },

    // Fleet Management
    { path: 'fleet', loadComponent: () => import('./features/fleet-recap/fleet-recap').then(m => m.FleetRecapComponent) },
    { path: 'vehicle/new', loadComponent: () => import('./features/vehicle-form/vehicle-form').then(m => m.VehicleFormComponent) },
    { path: 'vehicle/edit/:id', loadComponent: () => import('./features/vehicle-form/vehicle-form').then(m => m.VehicleFormComponent) }
];

