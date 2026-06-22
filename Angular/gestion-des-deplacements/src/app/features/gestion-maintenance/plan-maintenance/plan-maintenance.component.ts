import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plan-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatButtonToggleModule,
    MatCardModule,
    MatTooltipModule,
    CalendarModule,
    TranslateModule
  ],
  templateUrl: './plan-maintenance.component.html',
  styleUrls: ['./plan-maintenance.component.scss']
})
export class PlanMaintenanceComponent implements OnInit {
  viewMode: 'list' | 'calendar' = 'list';
  events: any[] = [];
  
  // Table view
  displayedColumns: string[] = ['eventType', 'vehicule', 'service', 'kmPrevu', 'kmRestants', 'dateEstimee', 'statut'];
  
  // Calendar view
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  calendarEvents: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMaintenancePlan();
  }

  loadMaintenancePlan() {
    this.http.get<any[]>(`${environment.apiUrl}/maintenance-tracking/calendar`).subscribe({
      next: (data) => {
        this.events = data.map(d => ({
          ...d,
          dateEstimee: new Date(d.dateEstimee)
        }));
        this.buildCalendarEvents();
      },
      error: (err) => console.error('Erreur chargement plan de maintenance:', err)
    });
  }

  buildCalendarEvents() {
    this.calendarEvents = this.events.map(event => {
      let primaryColor = '#2196f3'; // Bleu par défaut (service)
      let secondaryColor = '#e3f2fd';
      
      let title = `${event.immatriculation} - Service ${event.typeService}`;
      
      if (event.eventType === 'mouvement') {
        primaryColor = '#4caf50'; // Vert
        secondaryColor = '#e8f5e9';
        const timeString = event.dateEstimee.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        // Si le temps est 00:00, ça veut dire qu'il n'y a pas d'horaire précis renseigné, mais on l'affiche quand même si souhaité
        title = `${event.immatriculation} - Planification Confirmée (${timeString})`;
      } else if (event.eventType === 'alerte_conso') {
        primaryColor = '#9c27b0'; // Violet
        secondaryColor = '#f3e5f5';
        title = `${event.immatriculation} - Alerte Surconsommation`;
      } else if (event.kmRestants <= 0) {
        primaryColor = '#f44336'; // Rouge (Urgent)
        secondaryColor = '#ffebee';
      }

      return {
        start: event.dateEstimee,
        title: title,
        color: {
          primary: primaryColor,
          secondary: secondaryColor
        },
        meta: event
      };
    });
    this.refresh.next();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (date.getMonth() === this.viewDate.getMonth()) {
      if ((this.viewDate.getTime() === date.getTime() && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
}
