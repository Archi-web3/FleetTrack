import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChauffeurService } from '../chauffeur.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-gestion-chauffeurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-chauffeurs.component.html',
  styleUrls: ['./gestion-chauffeurs.component.css']
})
export class GestionChauffeursComponent implements OnInit {
  chauffeurs: any[] = [];
  newChauffeur: any = { nom: '', prenom: '', telephone: '', permis: '', disponible: true };
  selectedChauffeur: any = null; // Pour la modification
  userProfile: string | null = null;

  constructor(private chauffeurService: ChauffeurService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadChauffeurs();
    this.userProfile = this.authService.getUserProfile();
  }

  loadChauffeurs(): void {
    this.chauffeurService.getChauffeurs().subscribe(
      (data) => this.chauffeurs = data,
      (error) => console.error('Erreur chargement chauffeurs:', error)
    );
  }

  addChauffeur(): void {
    this.chauffeurService.addChauffeur(this.newChauffeur).subscribe(
      (response) => {
        alert('Chauffeur créé avec succès !');
        this.newChauffeur = { nom: '', prenom: '', telephone: '', permis: '', disponible: true }; // Reset form
        this.loadChauffeurs();
      },
      (error) => {
        console.error('Erreur création chauffeur:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à créer des chauffeurs.');
        else alert('Erreur lors de la création du chauffeur.');
      }
    );
  }

  selectChauffeur(chauffeur: any): void {
    this.selectedChauffeur = { ...chauffeur }; // Copie le chauffeur pour modification
  }

  updateChauffeur(): void {
    if (!this.selectedChauffeur) return;
    this.chauffeurService.updateChauffeur(this.selectedChauffeur._id, this.selectedChauffeur).subscribe(
      (response) => {
        alert('Chauffeur mis à jour avec succès !');
        this.selectedChauffeur = null; // Cacher le formulaire de modification
        this.loadChauffeurs();
      },
      (error) => {
        console.error('Erreur mise à jour chauffeur:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à modifier ce chauffeur.');
        else alert('Erreur lors de la mise à jour du chauffeur.');
      }
    );
  }

  deleteChauffeur(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      this.chauffeurService.deleteChauffeur(id).subscribe(
        (response) => {
          alert('Chauffeur supprimé avec succès !');
          this.loadChauffeurs();
        },
        (error) => {
          console.error('Erreur suppression chauffeur:', error);
          if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à supprimer des chauffeurs.');
          else alert('Erreur lors de la suppression du chauffeur.');
        }
      );
    }
  }
}
