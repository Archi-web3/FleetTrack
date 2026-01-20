import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChauffeurService } from '../chauffeur.service'; // Gardé pour la liste initiale via route /chauffeurs
import { UtilisateurService } from '../utilisateur.service'; // Pour update/delete complet
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';
import { ProjetService } from '../projet.service';

// Imports Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-gestion-chauffeurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  templateUrl: './gestion-chauffeurs.component.html',
  styleUrls: ['./gestion-chauffeurs.component.css']
})
export class GestionChauffeursComponent implements OnInit {
  chauffeurs: any[] = [];
  selectedChauffeur: any = null; // Pour la modification
  userProfile: string | null = null;
  userPaysId: string | null = null;

  // Données pour les listes déroulantes (comme GestionUtilisateurs)
  profiles = ['Chauffeur']; // Ici on cible surtout chauffeur, mais on garde la logic générique si besoin
  bases: any[] = [];
  paysList: any[] = [];
  vehicules: any[] = [];
  projets: any[] = [];

  constructor(
    private chauffeurService: ChauffeurService,
    private utilisateurService: UtilisateurService,
    private authService: AuthService,
    private adminService: AdminService,
    private projetService: ProjetService
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();

    if (this.userProfile === 'SuperAdmin') {
      this.loadPays();
    } else if (this.userProfile === 'Admin') {
      this.loadBases(this.userPaysId!);
    }

    this.loadVehicules();
    this.loadProjets();
    this.loadChauffeurs();
  }

  loadChauffeurs(): void {
    // On continue d'utiliser le service chauffeur qui tape sur /api/chauffeurs (qui renvoie les Utilisateurs 'Chauffeur')
    this.chauffeurService.getChauffeurs().subscribe(
      (data) => this.chauffeurs = data,
      (error) => console.error('Erreur chargement chauffeurs:', error)
    );
  }

  loadPays() {
    this.adminService.getPays().subscribe(data => this.paysList = data);
  }

  loadBases(paysId?: string) {
    this.adminService.getBases(paysId).subscribe(
      data => this.bases = data,
      error => console.error('Erreur chargement bases:', error)
    );
  }

  loadVehicules(): void {
    this.adminService.getVehicules().subscribe(
      (data) => this.vehicules = data,
      (error) => console.error('Erreur chargement véhicules:', error)
    );
  }

  loadProjets(): void {
    this.projetService.getProjets(false).subscribe(
      (data) => this.projets = data,
      (error) => console.error('Erreur chargement projets:', error)
    );
  }

  selectChauffeur(chauffeur: any): void {
    this.selectedChauffeur = { ...chauffeur, motDePasse: '' }; // Copie pour modif

    // Gestion des objets peuplés (base, pays) -> extraction ID
    if (this.selectedChauffeur.base && this.selectedChauffeur.base._id) {
      this.selectedChauffeur.base = this.selectedChauffeur.base._id;
    }
    let paysId = this.selectedChauffeur.pays;
    if (this.selectedChauffeur.pays && this.selectedChauffeur.pays._id) {
      paysId = this.selectedChauffeur.pays._id;
      this.selectedChauffeur.pays = paysId;
    }

    // Chargement des bases contextuelles
    if (paysId) {
      this.loadBases(paysId);
    } else if (this.userProfile === 'Admin' && this.userPaysId) {
      this.loadBases(this.userPaysId);
    }
  }

  onEditPaysChange(paysId: string) {
    if (this.selectedChauffeur) {
      this.selectedChauffeur.pays = paysId;
      this.selectedChauffeur.base = '';
      this.loadBases(paysId);
    }
  }

  updateChauffeur(): void {
    if (!this.selectedChauffeur) return;

    // Nettoyage avant envoi
    const userData = { ...this.selectedChauffeur };
    if (!userData.motDePasse || userData.motDePasse.trim() === '') {
      delete userData.motDePasse;
    }
    if (userData.pays === '') userData.pays = null;
    if (userData.base === '') userData.base = null;
    if (userData.vehiculeAttitre === '') userData.vehiculeAttitre = null;

    // Utilisation de UtilisateurService pour mise à jour complète
    this.utilisateurService.updateUser(this.selectedChauffeur._id, userData).subscribe(
      (response) => {
        alert('Chauffeur mis à jour avec succès !');
        this.selectedChauffeur = null;
        this.loadChauffeurs();
      },
      (error) => {
        console.error('Erreur mise à jour chauffeur:', error);
        if (error.status === 403) alert('Accès refusé.');
        else alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message));
      }
    );
  }

  deleteChauffeur(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      // Utilisation de UtilisateurService pour suppression complète
      this.utilisateurService.deleteUser(id).subscribe(
        (response) => {
          alert('Chauffeur supprimé avec succès !');
          this.loadChauffeurs();
        },
        (error) => {
          console.error('Erreur suppression chauffeur:', error);
          if (error.status === 403) alert('Accès refusé.');
          else alert('Erreur lors de la suppression.');
        }
      );
    }
  }
}
