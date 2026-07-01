import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../core/services/stats.service';
import { AuthService } from '../../core/services/auth.service';
import { MouvementService } from '../../core/services/mouvement.service';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
    MatDividerModule,
    TranslateModule,
  ],
  templateUrl: './tableau-bord.component.html',
  styleUrls: ['./tableau-bord.component.scss'],
})
export class TableauBordComponent implements OnInit {
  private statsService = inject(StatsService);
  private authService = inject(AuthService);
  private mouvementService = inject(MouvementService);

  // Colonnes affichées dans le tableau
  displayedColumns: string[] = [
    'projet',
    'kmInvolved',
    'km',
    'ratioKm',
    'co2',
    'ratioCO2',
    'consommation',
    'ratioConsommation',
    'tauxRemplissage',
    'mouvements',
  ];
  // Filtres
  dateDebut: Date | null = null;
  dateFin: Date | null = null;
  projetFiltre = '';
  vehiculeFiltre = '';

  // Listes pour les filtres
  projets: string[] = [];
  vehicules: any[] = [];

  // Statistiques
  statsGlobales: any = {
    kmTotaux: 0,
    co2Total: 0,
    co2Flotte: 0,
    co2Aerien: 0,
    consommationTotale: 0,
    nombreMouvements: 0,
    repartitionModes: {
      routier: 0,
      aerien: 0,
      maritime: 0,
    },
    indicateursAvances: {
      trajetsCourts: { count: 0, pourcentage: 0 },
      kmMutualises: { km: 0, pourcentage: 0 },
      tauxUtilisation: 0,
    },
  };
  statsParProjet: any[] = [];

  userProfile: string | null = null;

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();

    // Initialiser les dates (dernier mois par défaut)
    const today = new Date();
    this.dateFin = today;
    this.dateDebut = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    this.mouvementService.fixCountries().subscribe({
      next: (res) => {
        this.loadDashboardData();
      },
      error: (err) => {
        console.warn('[TableauBord] Auto-repair failed (continuing anyway):', err);
        this.loadDashboardData();
      },
    });
  }

  loadDashboardData(): void {
    // Charger les listes pour les filtres
    this.chargerProjets();
    this.chargerVehicules();

    // Charger les statistiques initiales
    this.chargerStatistiques();
  }

  chargerProjets(): void {
    this.statsService.getProjets().subscribe(
      (data) => (this.projets = data),
      (error) => console.error('Erreur chargement projets:', error),
    );
  }

  chargerVehicules(): void {
    this.statsService.getVehicules().subscribe(
      (data) => (this.vehicules = data),
      (error) => console.error('Erreur chargement véhicules:', error),
    );
  }

  chargerStatistiques(): void {
    const dateDebutStr = this.dateDebut ? this.dateDebut.toISOString().split('T')[0] : undefined;
    const dateFinStr = this.dateFin ? this.dateFin.toISOString().split('T')[0] : undefined;
    const projet = this.projetFiltre || undefined;
    const vehicule = this.vehiculeFiltre || undefined;

    // Charger les stats globales
    this.statsService.getStatsGlobales(dateDebutStr, dateFinStr, projet, vehicule).subscribe(
      (data) => {
        this.statsGlobales = data;
      },
      (error) => console.error('Erreur stats globales:', error),
    );

    // Charger les stats par projet
    this.statsService.getStatsParProjet(dateDebutStr, dateFinStr, vehicule).subscribe(
      (data) => {
        this.statsParProjet = data.parProjet || [];
      },
      (error) => console.error('Erreur stats par projet:', error),
    );
  }
}
