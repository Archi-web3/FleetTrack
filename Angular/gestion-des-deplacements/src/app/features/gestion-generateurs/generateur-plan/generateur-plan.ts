import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { GenerateursService } from '../../../core/services/generateurs.service';
import { InfoBannerComponent } from '../../../core/info-banner/info-banner';

@Component({
  selector: 'app-generateur-plan',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
    InfoBannerComponent
  ],
  templateUrl: './generateur-plan.html',
  styleUrls: ['./generateur-plan.css']
})
export class GenerateurPlanComponent implements OnInit {
  displayedColumns: string[] = ['generateur', 'heuresActuelles', 'prochainService', 'heuresRestantes', 'statut', 'actions'];
  dataSource: any[] = [];
  loading = false;

  constructor(private generateursService: GenerateursService) {}

  ngOnInit(): void {
    this.loadPlan();
  }

  loadPlan() {
    this.loading = true;
    this.generateursService.getMaintenanceOverview().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement plan', err);
        this.loading = false;
      }
    });
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'À jour': return 'primary';
      case 'Dû bientôt': return 'accent';
      case 'En retard': return 'warn';
      default: return '';
    }
  }
}
