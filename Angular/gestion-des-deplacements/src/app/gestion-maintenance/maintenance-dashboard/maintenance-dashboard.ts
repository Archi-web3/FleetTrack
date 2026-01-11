import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MaintenanceTrackingComponent } from '../../maintenance-tracking/maintenance-tracking.component';
import { ServiceConfigComponent } from '../service-config/service-config';
import { TemplateManagerComponent } from '../template-manager/template-manager';

@Component({
    selector: 'app-maintenance-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MaintenanceTrackingComponent,
        ServiceConfigComponent,
        TemplateManagerComponent
    ],
    templateUrl: './maintenance-dashboard.html',
    styleUrls: ['./maintenance-dashboard.scss']
})
export class MaintenanceDashboardComponent {
    // Le dashboard est maintenant un conteneur d'onglets
    // La logique spécifique est déléguée aux composants enfants
}
