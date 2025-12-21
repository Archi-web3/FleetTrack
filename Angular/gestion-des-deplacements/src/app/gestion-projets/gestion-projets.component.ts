import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetService } from '../projet.service';
import { AuthService } from '../auth.service';

// Imports Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-gestion-projets',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTableModule,
        MatIconModule
    ],
    templateUrl: './gestion-projets.component.html',
    styleUrls: ['./gestion-projets.component.css']
})
export class GestionProjetsComponent implements OnInit {
    projets: any[] = [];
    selectedProjet: any = null;
    newProjet: any = {
        nom: '',
        code: '',
        description: '',
        actif: true
    };
    userProfile: string | null = null;
    displayedColumns: string[] = ['nom', 'code', 'actif', 'actions'];

    constructor(
        private projetService: ProjetService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.userProfile = this.authService.getUserProfile();
        this.loadProjets();
    }

    loadProjets(): void {
        this.projetService.getProjets(true).subscribe(
            (data) => {
                this.projets = data;
                console.log('Projets chargés:', this.projets);
            },
            (error) => console.error('Erreur chargement projets:', error)
        );
    }

    addProjet(): void {
        if (!this.newProjet.nom || this.newProjet.nom.trim() === '') {
            alert('Le nom du projet est obligatoire');
            return;
        }

        if (!this.newProjet.code || this.newProjet.code.trim() === '') {
            alert('Le code du projet est obligatoire');
            return;
        }
        this.projetService.addProjet(this.newProjet).subscribe(
            (response) => {
                alert('Projet créé avec succès !');
                this.newProjet = {
                    nom: '',
                    code: '',
                    description: '',
                    actif: true
                };
                this.loadProjets();
            },
            (error) => {
                console.error('Erreur création projet:', error);
                alert('Erreur lors de la création: ' + (error.error?.message || error.message));
            }
        );
    }

    selectProjet(projet: any): void {
        this.selectedProjet = { ...projet };
    }

    updateProjet(): void {
        if (!this.selectedProjet) return;

        this.projetService.updateProjet(this.selectedProjet._id, this.selectedProjet).subscribe(
            (response) => {
                alert('Projet mis à jour avec succès !');
                this.selectedProjet = null;
                this.loadProjets();
            },
            (error) => {
                console.error('Erreur mise à jour projet:', error);
                alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message));
            }
        );
    }

    deleteProjet(id: string, nom: string): void {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${nom}" ?`)) {
            this.projetService.deleteProjet(id).subscribe(
                (response) => {
                    alert('Projet supprimé avec succès !');
                    this.loadProjets();
                },
                (error) => {
                    console.error('Erreur suppression projet:', error);
                    if (error.status === 403) {
                        alert('Accès refusé. Seul le SuperAdmin peut supprimer des projets.');
                    } else {
                        alert('Erreur lors de la suppression.');
                    }
                }
            );
        }
    }

    cancelEdit(): void {
        this.selectedProjet = null;
    }
}
