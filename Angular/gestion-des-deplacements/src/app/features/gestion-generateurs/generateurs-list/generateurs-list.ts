import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { GenerateursService, Generateur } from '../../../core/services/generateurs.service';

@Component({
  selector: 'app-generateurs-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './generateurs-list.html',
  styleUrls: ['./generateurs-list.css']
})
export class GenerateursListComponent implements OnInit {
  displayedColumns: string[] = ['marque', 'modele', 'puissanceKVA', 'numeroSerie', 'site', 'heures', 'statut', 'actions'];
  dataSource: Generateur[] = [];
  loading = false;

  constructor(private generateursService: GenerateursService) {}

  ngOnInit(): void {
    this.loadGenerateurs();
  }

  loadGenerateurs() {
    this.loading = true;
    this.generateursService.getGenerateurs().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement générateurs', err);
        this.loading = false;
      }
    });
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'Actif': return 'primary';
      case 'En maintenance': return 'accent';
      case 'En panne': return 'warn';
      case 'Hors service': return 'warn';
      default: return '';
    }
  }
}
