import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeMouvementsComponent } from '../liste-mouvements/liste-mouvements.component';
import { PlanningMouvementsComponent } from '../planning-mouvements/planning-mouvements.component';

@Component({
  selector: 'app-trip-management',
  standalone: true,
  imports: [CommonModule, ListeMouvementsComponent, PlanningMouvementsComponent],
  templateUrl: './trip-management.html',
  styleUrls: ['./trip-management.css']
})
export class TripManagementComponent {
  currentView: 'list' | 'calendar' = 'list';

  setView(view: 'list' | 'calendar') {
    this.currentView = view;
  }
}

