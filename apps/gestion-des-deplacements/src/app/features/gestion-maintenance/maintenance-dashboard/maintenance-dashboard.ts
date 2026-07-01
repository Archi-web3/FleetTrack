import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MaintenanceTrackingComponent } from '../../maintenance-tracking/maintenance-tracking.component';
import { WeeklyChecklistTracker } from '../weekly-checklist-tracker/weekly-checklist-tracker';

@Component({
  selector: 'app-maintenance-dashboard',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    TranslateModule,
    MaintenanceTrackingComponent,
    WeeklyChecklistTracker,
  ],
  templateUrl: './maintenance-dashboard.html',
  styleUrls: ['./maintenance-dashboard.scss'],
})
export class MaintenanceDashboardComponent {
  // Le dashboard est maintenant un conteneur d'onglets
  // La logique spécifique est déléguée aux composants enfants
}
