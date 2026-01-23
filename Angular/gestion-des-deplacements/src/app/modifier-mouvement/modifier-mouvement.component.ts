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
            lieuDepart: (data.stops && data.stops.length > 0) ? (data.stops[0].lieu?._id || data.stops[0].lieu) : '', // Fix: Read from stops
            lieuArrivee: (data.stops && data.stops.length > 0) ? (data.stops[data.stops.length - 1].lieu?._id || data.stops[data.stops.length - 1].lieu) : '', // Fix: Read from stops
            demandeur: data.demandeur?._id || data.demandeur, // Handle populated demandeur
            vehicule: data.vehicule?._id || null, // Utiliser l'ID du véhicule, ou null
            chauffeur: data.chauffeur?._id || null, // Utiliser l'ID du chauffeur, ou null
            dateDepart: this.formatDateForInput(data.dateDepart), // Formater pour input datetime-local
            dateArrivee: this.formatDateForInput(data.dateArrivee), // Formater pour input datetime-local
          };
          this.selectedPassagersIds = data.passagers ? data.passagers.map((p: any) => p._id) : [];

          // Si pas de ventilation existante (anciens mouvements), on calcule automatiquement
          if (!this.mouvement.projetsVentilation || this.mouvement.projetsVentilation.length === 0) {
            // Un petit délai pour s'assurer que 'utilisateurs' sont chargés si ce n'est pas le cas, 
            // mais loadData lance les appels en parallèle. 
            // Idéalement on devrait attendre que tout soit chargé.
            // On va vérifier si utilisateurs est vide, sinon on attend un peu ou on le fait après le chargement des utilisateurs.
            if (this.utilisateurs.length > 0) {
              this.calculateVentilation();
            } else {
              // Retry after short delay or wait for users
              setTimeout(() => this.calculateVentilation(), 500);
            }
          }
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

  // --- Gestion de la Ventilation Financière ---
  addVentilationItem(): void {
    if (!this.mouvement.projetsVentilation) {
      this.mouvement.projetsVentilation = [];
    }
    this.mouvement.projetsVentilation.push({ projet: '', percentage: 0 });
  }

  removeVentilationItem(index: number): void {
    if (this.mouvement.projetsVentilation) {
      this.mouvement.projetsVentilation.splice(index, 1);
    }
  }

  get totalVentilation(): number {
    if (!this.mouvement.projetsVentilation) return 0;
    return this.mouvement.projetsVentilation.reduce((acc: number, item: any) => acc + item.percentage, 0);
  }

  // Calcul automatique de la ventilation basé sur les passagers sélectionnés
  calculateVentilation(): void {
    if (!this.utilisateurs || this.utilisateurs.length === 0) return;
    if (!this.selectedPassagersIds || this.selectedPassagersIds.length === 0) {
      // Si aucun passager, peut-être remettre à 0 ou ne rien faire ? 
      // On va dire que si pas de passagers, pas de ventilation auto.
      return;
    }

    const passengerProjects: string[] = [];

    this.selectedPassagersIds.forEach(id => {
      const user = this.utilisateurs.find(u => u._id === id);
      if (user && user.projet) {
        passengerProjects.push(user.projet);
      } else {
        passengerProjects.push('Non assigné');
      }
    });

    const totalPassengers = passengerProjects.length;
    const projectCounts: { [key: string]: number } = {};

    passengerProjects.forEach(proj => {
      projectCounts[proj] = (projectCounts[proj] || 0) + 1;
    });

    const newVentilation = [];
    for (const [projet, count] of Object.entries(projectCounts)) {
      const percentage = Math.round((count / totalPassengers) * 100);
      newVentilation.push({ projet, percentage });
    }

    // Corriger les arrondis pour avoir 100%
    const currentTotal = newVentilation.reduce((sum, item) => sum + item.percentage, 0);
    if (currentTotal !== 100 && newVentilation.length > 0) {
      const diff = 100 - currentTotal;
      // Ajouter la différence au premier item (ou au plus grand)
      newVentilation[0].percentage += diff;
    }

    this.mouvement.projetsVentilation = newVentilation;
  }

  onPassengersChange(): void {
    // Méthode appelée quand la sélection de passagers change
    // On propose de recalculer la ventilation
    if (confirm('Voulez-vous recalculer automatiquement la ventilation financière basée sur les nouveaux passagers ? (Cela écrasera la ventilation actuelle)')) {
      this.calculateVentilation();
    }
  }


  onSubmit(): void {
    console.log('🔄 [modifier-mouvement] onSubmit called via click'); // Debug
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
