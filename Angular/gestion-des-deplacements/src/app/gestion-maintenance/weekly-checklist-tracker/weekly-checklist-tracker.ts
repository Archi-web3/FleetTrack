import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaintenanceService } from '../../maintenance.service';

@Component({
  selector: 'app-weekly-checklist-tracker',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './weekly-checklist-tracker.html',
  styleUrls: ['./weekly-checklist-tracker.css']
})
export class WeeklyChecklistTracker implements OnInit {
  vehicles: any[] = [];
  displayedColumns: string[] = ['vehicule', 'lastDate', 'status', 'actions'];
  loading = true;

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.maintenanceService.getMaintenanceOverview().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.sortVehicles();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading checklist data', err);
        this.loading = false;
      }
    });
  }

  sortVehicles() {
    // Priority: Late > Never > OK
    const priority = { 'late': 0, 'never': 1, 'ok': 2 };
    this.vehicles.sort((a, b) => {
      const statusA = a.checklist?.status || 'never';
      const statusB = b.checklist?.status || 'never';
      return (priority[statusA as keyof typeof priority] || 2) - (priority[statusB as keyof typeof priority] || 2);
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ok': return 'primary';
      case 'late': return 'warn';
      case 'never': return 'accent'; // Or gray/default
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ok': return 'À Jour';
      case 'late': return 'En Retard';
      case 'never': return 'Jamais Fait';
      default: return 'Inconnu';
    }
  }

  viewHistory(vehicle: any) {
    console.log('View history for', vehicle.vehicule.immatriculation);
    // Future: Navigate to detailed history or open dialog
  }
}
