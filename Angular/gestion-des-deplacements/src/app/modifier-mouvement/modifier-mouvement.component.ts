import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // ActivatedRoute pour récupérer l'ID
import { MouvementService } from '../mouvement.service';
import { UtilisateurService } from '../utilisateur.service';
import { VehiculeService } from '../vehicule.service';
import { ChauffeurService } from '../chauffeur.service';
import { LieuService } from '../lieu.service';
import { AuthService } from '../auth.service';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modifier-mouvement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './modifier-mouvement.component.html',
  styleUrls: ['./modifier-mouvement.component.css']
})
export class ModifierMouvementComponent implements OnInit {
  mouvementId: string | null = null;
  mouvement: any = {
    lieuDepart: '',
    lieuArrivee: '',
    dateDepart: '',
    dateArrivee: '',
    demandeur: '',
    vehicule: null, // Initialiser à null car non requis à la création
    chauffeur: null, // Initialiser à null car non requis à la création
    passagers: [],
    materiel: '',
    objectif: '',
    statut: '' // Permettre la modification du statut si nécessaire
  };

  utilisateurs: any[] = [];
  vehicules: any[] = [];
  chauffeurs: any[] = [];
  lieux: any[] = [];
  transportModes: string[] = ['Routier', 'Aérien', 'Maritime'];
  mouvementStatuts = ['en attente', 'en attente validation sécurité', 'validé', 'en cours', 'terminé', 'annulé', 'refusé'];

  // Ces variables sont pour gérer les nouveaux lieux, mais ici on les désactive
  // car la modification ne devrait concerner que les lieux existants
  selectedLieuDepartOption: 'existing' | 'new' = 'existing';
  selectedLieuArriveeOption: 'existing' | 'new' = 'existing';
  newLieuDepart: any; // Non utilisé pour la modification d'un mouvement existant
  newLieuArrivee: any; // Non utilisé pour la modification d'un mouvement existant

  // Pour la sélection multiple des passagers
  selectedPassagersIds: string[] = [];

  constructor(
    private route: ActivatedRoute, // Pour récupérer l'ID du mouvement de l'URL
    public router: Router,
    private mouvementService: MouvementService,
    private utilisateurService: UtilisateurService,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService,
    private lieuService: LieuService,
    public authService: AuthService // Public pour le template si besoin
  ) { }

  ngOnInit(): void {
    this.mouvementId = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID de l'URL
    this.loadData();
  }

  loadData(): void {
    // Charger les listes pour les sélecteurs
    this.utilisateurService.getUtilisateurs().subscribe(
      (data) => this.utilisateurs = data,
      (error) => console.error('Erreur chargement utilisateurs:', error)
    );
    this.vehiculeService.getVehicules().subscribe(
      (data) => this.vehicules = data,
      (error) => console.error('Erreur chargement véhicules:', error)
    );
    this.chauffeurService.getChauffeurs().subscribe(
      (data) => this.chauffeurs = data,
      (error) => console.error('Erreur chargement chauffeurs:', error)
    );
    this.lieuService.getLieux().subscribe(
      (data) => this.lieux = data,
      (error) => console.error('Erreur chargement lieux:', error)
    );

    // Charger le mouvement à modifier
    if (this.mouvementId) {
      this.mouvementService.getMouvementById(this.mouvementId).subscribe(
        (data) => {
          this.mouvement = {
            ...data,
            lieuDepart: data.lieuDepart?._id || '', // Utiliser l'ID du lieu
            lieuArrivee: data.lieuArrivee?._id || '', // Utiliser l'ID du lieu
            demandeur: data.demandeur?._id || '', // Utiliser l'ID du demandeur
            vehicule: data.vehicule?._id || null, // Utiliser l'ID du véhicule, ou null
            chauffeur: data.chauffeur?._id || null, // Utiliser l'ID du chauffeur, ou null
            dateDepart: this.formatDateForInput(data.dateDepart), // Formater pour input datetime-local
            dateArrivee: this.formatDateForInput(data.dateArrivee), // Formater pour input datetime-local
          };
          this.selectedPassagersIds = data.passagers ? data.passagers.map((p: any) => p._id) : [];
        },
        (error) => console.error('Erreur chargement mouvement à modifier:', error)
      );
    }
  }

  // Helper pour formater les dates pour le input type="datetime-local"
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Date.prototype.toISOString() renvoie 'YYYY-MM-DDTHH:mm:ss.sssZ'
    // Nous voulons 'YYYY-MM-DDTHH:mm'
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (!this.mouvementId) return;

    // Assigner les passagers sélectionnés
    this.mouvement.passagers = this.selectedPassagersIds;

    this.mouvementService.updateMouvement(this.mouvementId, this.mouvement).subscribe(
      (response) => {
        alert('Mouvement mis à jour avec succès !');
        this.router.navigate(['/']); // Rediriger vers la liste des mouvements
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du mouvement:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à modifier ce mouvement.');
        else alert('Erreur lors de la mise à jour. Vérifiez la console.');
      }
    );
  }
}
