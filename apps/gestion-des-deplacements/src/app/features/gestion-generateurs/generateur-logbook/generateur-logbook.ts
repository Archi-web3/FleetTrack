import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { GenerateursService, Generateur } from '../../../core/services/generateurs.service';
import { InfoBannerComponent } from '../../../core/info-banner/info-banner';

@Component({
  selector: 'app-generateur-logbook',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    RouterModule,
    InfoBannerComponent,
  ],
  templateUrl: './generateur-logbook.html',
  styleUrls: ['./generateur-logbook.css'],
})
export class GenerateurLogbookComponent implements OnInit {
  private generateursService = inject(GenerateursService);
  private snackBar = inject(MatSnackBar);

  generateurs: Generateur[] = [];
  selectedGenerateurId: string | null = null;
  generateur: Generateur | null = null;
  loading = false;

  logbooks: any[] = [];
  displayedLogbookColumns = [
    'dateReleve',
    'heureDebut',
    'heureFin',
    'dureeSession',
    'carburantAjoute',
    'consommationLpH',
    'utilisateur',
  ];
  newLogbook = {
    dateReleve: new Date(),
    heureDebut: 0,
    heureFin: 0,
    carburantAjoute: 0,
    observations: '',
  };

  ngOnInit(): void {
    this.loadGenerateurs();
  }

  loadGenerateurs() {
    this.loading = true;
    this.generateursService.getGenerateurs().subscribe({
      next: (data) => {
        this.generateurs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des générateurs', 'Fermer');
      },
    });
  }

  onSelectGenerateur() {
    if (!this.selectedGenerateurId) return;
    this.loading = true;
    this.generateursService.getGenerateur(this.selectedGenerateurId).subscribe((gen) => {
      this.generateur = gen;
      this.newLogbook.heureDebut = gen.heuresFonctionnement;
      this.newLogbook.heureFin = gen.heuresFonctionnement;

      this.generateursService.getLogbooks(this.selectedGenerateurId!).subscribe((logs) => {
        this.logbooks = logs;
        this.loading = false;
      });
    });
  }

  addLogbook() {
    if (!this.selectedGenerateurId) return;
    if (this.newLogbook.heureFin <= this.newLogbook.heureDebut) {
      this.snackBar.open("L'heure de fin doit être supérieure à l'heure de début", 'Fermer');
      return;
    }

    this.generateursService.addLogbook(this.selectedGenerateurId, this.newLogbook).subscribe({
      next: () => {
        this.snackBar.open('Relevé logbook ajouté', 'OK', { duration: 2000 });
        this.onSelectGenerateur(); // Recharger les données pour màj du générateur et de la liste
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open("Erreur lors de l'ajout", 'Fermer');
      },
    });
  }
}
