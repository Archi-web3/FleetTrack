import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LieuService } from '../lieu.service';
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-gestion-lieux',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-lieux.component.html',
  styleUrls: ['./gestion-lieux.component.css']
})
export class GestionLieuxComponent implements OnInit {
  lieux: any[] = [];
  newLieu: any = { nom: '', adresse: '', coordonnees: { latitude: 0, longitude: 0 }, estSensible: false, niveauSecurite: 1, pays: '', base: '' };
  selectedLieu: any = null;
  userProfile: string | null = null;
  userPaysId: string | null = null;
  userBaseId: string | null = null;

  // Pour SuperAdmin
  paysList: any[] = [];
  basesList: any[] = [];

  // Niveaux de sécurité
  securityLevels = [
    { level: 1, color: '#4CAF50', label: '1 - Stable' },
    { level: 2, color: '#FFEB3B', label: '2 - Modéré' },
    { level: 3, color: '#FF9800', label: '3 - Difficile' },
    { level: 4, color: '#F44336', label: '4 - Élevé' },
    { level: 5, color: '#000000', label: '5 - Extrême' }
  ];

  // Pour filtrage
  showAllBasesInPays: boolean = false; // Option pour voir les lieux d'autres bases du même pays

  constructor(
    private lieuService: LieuService,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();
    this.userBaseId = this.authService.getUserBaseId();

    console.log('=== DEBUG GESTION LIEUX ===');
    console.log('userProfile:', this.userProfile);
    console.log('userPaysId:', this.userPaysId);
    console.log('userBaseId:', this.userBaseId);

    if (this.userProfile === 'SuperAdmin') {
      this.loadPays();
    } else if (this.userProfile === 'Admin' || this.userProfile === 'Superviseur') {
      // Admin/Superviseur : forcer leur pays/base
      this.newLieu.pays = this.userPaysId;
      this.newLieu.base = this.userBaseId;
      console.log('newLieu.pays assigné:', this.newLieu.pays);
      console.log('newLieu.base assigné:', this.newLieu.base);
      if (this.userPaysId) {
        this.loadBases(this.userPaysId);
      }
    }

    this.loadLieux();
  }

  loadPays(): void {
    this.adminService.getPays().subscribe(
      (data) => this.paysList = data,
      (error) => console.error('Erreur chargement pays:', error)
    );
  }

  loadBases(paysId?: string): void {
    this.adminService.getBases(paysId).subscribe(
      (data) => this.basesList = data,
      (error) => console.error('Erreur chargement bases:', error)
    );
  }

  onPaysChange(): void {
    this.newLieu.base = ''; // Reset base selection
    if (this.newLieu.pays) {
      this.loadBases(this.newLieu.pays);
    } else {
      this.basesList = [];
    }
  }

  loadLieux(): void {
    this.lieuService.getLieux().subscribe(
      (data) => {
        // Filtrage côté client
        if (this.userProfile === 'SuperAdmin') {
          // SuperAdmin voit tout
          this.lieux = data;
        } else if (!this.showAllBasesInPays && this.userBaseId) {
          // Afficher uniquement les lieux de ma base (exclure les lieux sans base)
          this.lieux = data.filter((lieu: any) =>
            lieu.base && lieu.base._id === this.userBaseId
          );
        } else if (this.showAllBasesInPays && this.userPaysId) {
          // Afficher tous les lieux du même pays (exclure les lieux sans pays)
          this.lieux = data.filter((lieu: any) =>
            lieu.pays && lieu.pays._id === this.userPaysId
          );
        } else {
          this.lieux = data;
        }
      },
      (error) => console.error('Erreur chargement lieux:', error)
    );
  }

  toggleShowAllBasesInPays(): void {
    this.showAllBasesInPays = !this.showAllBasesInPays;
    this.loadLieux();
  }

  addLieu(): void {
    const nom = this.newLieu.nom.trim();
    const adresse = this.newLieu.adresse.trim();
    const lat = Number(this.newLieu.coordonnees.latitude);
    const long = Number(this.newLieu.coordonnees.longitude);

    if (nom === '' || adresse === '' || isNaN(lat) || isNaN(long)) {
      alert("Veuillez remplir tous les champs (Nom, Adresse, Latitude, Longitude) pour le nouveau lieu.");
      return;
    }

    this.newLieu.coordonnees.latitude = lat;
    this.newLieu.coordonnees.longitude = long;

    this.lieuService.addLieu(this.newLieu).subscribe(
      (response) => {
        alert('Lieu créé avec succès !');
        this.newLieu = {
          nom: '',
          adresse: '',
          coordonnees: { latitude: 0, longitude: 0 },
          estSensible: false,
          niveauSecurite: 1,
          pays: this.userProfile === 'SuperAdmin' ? '' : this.userPaysId,
          base: this.userProfile === 'SuperAdmin' ? '' : this.userBaseId
        };
        this.loadLieux();
      },
      (error) => {
        console.error('Erreur création lieu:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à créer des lieux.');
        else alert('Erreur lors de la création du lieu.');
      }
    );
  }

  selectLieu(lieu: any): void {
    this.selectedLieu = { ...lieu };
  }

  updateLieu(): void {
    if (!this.selectedLieu) return;

    const nom = this.selectedLieu.nom.trim();
    const adresse = this.selectedLieu.adresse.trim();
    const lat = Number(this.selectedLieu.coordonnees.latitude);
    const long = Number(this.selectedLieu.coordonnees.longitude);

    if (nom === '' || adresse === '' || isNaN(lat) || isNaN(long)) {
      alert("Veuillez remplir tous les champs (Nom, Adresse, Latitude, Longitude) pour le lieu à modifier.");
      return;
    }

    this.selectedLieu.coordonnees.latitude = lat;
    this.selectedLieu.coordonnees.longitude = long;

    this.lieuService.updateLieu(this.selectedLieu._id, this.selectedLieu).subscribe(
      (response) => {
        alert('Lieu mis à jour avec succès !');
        this.selectedLieu = null;
        this.loadLieux();
      },
      (error) => {
        console.error('Erreur mise à jour lieu:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à modifier ce lieu.');
        else alert('Erreur lors de la mise à jour du lieu.');
      }
    );
  }

  deleteLieu(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
      this.lieuService.deleteLieu(id).subscribe(
        (response) => {
          alert('Lieu supprimé avec succès !');
          this.loadLieux();
        },
        (error) => {
          console.error('Erreur suppression lieu:', error);
          if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à supprimer des lieux.');
          else alert('Erreur lors de la suppression du lieu.');
        }
      );
    }
  }
}
