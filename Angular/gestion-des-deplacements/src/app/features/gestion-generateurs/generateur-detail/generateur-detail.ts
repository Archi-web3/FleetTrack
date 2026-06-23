import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InfoBannerComponent } from '../../../core/info-banner/info-banner';
import { GenerateursService, Generateur } from '../../../core/services/generateurs.service';

@Component({
  selector: 'app-generateur-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    RouterModule,
    InfoBannerComponent,
    TranslateModule
  ],
  templateUrl: './generateur-detail.html',
  styleUrls: ['./generateur-detail.css']
})
export class GenerateurDetailComponent implements OnInit {
  generateurId!: string;
  generateur!: Generateur;
  loading = true;

  // Logbook
  logbooks: any[] = [];
  displayedLogbookColumns = ['dateReleve', 'heureDebut', 'heureFin', 'dureeSession', 'carburantAjoute', 'consommationLpH', 'utilisateur'];
  newLogbook = {
    dateReleve: new Date(),
    heureDebut: 0,
    heureFin: 0,
    carburantAjoute: 0,
    observations: ''
  };

  // Interventions
  interventions: any[] = [];
  displayedInterventionColumns = ['dateIntervention', 'typeIntervention', 'frequence', 'heuresActuelles', 'nomIntervenant', 'statut'];

  constructor(
    private route: ActivatedRoute,
    private generateursService: GenerateursService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generateurId = this.route.snapshot.paramMap.get('id') || '';
    if (this.generateurId) {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.generateursService.getGenerateur(this.generateurId).subscribe(gen => {
      this.generateur = gen;
      this.newLogbook.heureDebut = gen.heuresFonctionnement;
      this.newLogbook.heureFin = gen.heuresFonctionnement;
      
      this.generateursService.getLogbooks(this.generateurId).subscribe(logs => this.logbooks = logs);
      this.generateursService.getInterventions(this.generateurId).subscribe(intervs => this.interventions = intervs);
      
      this.loading = false;
    });
  }

  addLogbook() {
    if (this.newLogbook.heureFin <= this.newLogbook.heureDebut) {
      this.snackBar.open('L\'heure de fin doit être supérieure à l\'heure de début', 'Fermer');
      return;
    }

    this.generateursService.addLogbook(this.generateurId, this.newLogbook).subscribe({
      next: () => {
        this.snackBar.open('Relevé logbook ajouté', 'OK', { duration: 2000 });
        this.loadData(); // Recharger les données pour màj du générateur et de la liste
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors de l\'ajout', 'Fermer');
      }
    });
  }
}
