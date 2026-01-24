import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MouvementService } from '../mouvement.service';
import { UtilisateurService } from '../utilisateur.service';
import { VehiculeService } from '../vehicule.service';
import { ChauffeurService } from '../chauffeur.service';
import { LieuService } from '../lieu.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service'; // NOUVEAU : Importer AuthService
import { OsrmService } from '../core/services/osrm.service'; // NOUVEAU

@Component({
  selector: 'app-demande-mouvement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-mouvement.component.html',
  styleUrls: ['./demande-mouvement.component.css']
})
export class DemandeMouvementComponent implements OnInit {

  mouvement = {
    lieuDepart: '',
    lieuArrivee: '',
    dateDepart: '',
    dateArrivee: '',
    demandeur: '', // Sera défini automatiquement
    vehicule: null as string | null, // <<< MODIFIÉ : Peut être null
    chauffeur: null as string | null, // <<< MODIFIÉ : Peut être null
    passagers: [] as string[], // NOUVEAU : Champ pour les passagers (IDs)
    materiel: '', // Exemple, si vous voulez l'ajouter au formulaire
    objectif: '',
    modeTransport: 'Routier' // Module 2 : Mode de transport par défaut
  };

  transportModes: string[] = ['Routier', 'Aérien', 'Maritime'];

  utilisateurs: any[] = [];
  vehicules: any[] = [];
  chauffeurs: any[] = [];
  lieux: any[] = [];

  selectedLieuDepartOption: 'existing' | 'new' = 'existing';
  selectedLieuArriveeOption: 'existing' | 'new' = 'existing';

  newLieuDepart = { nom: '', adresse: '', coordonnees: { latitude: 0, longitude: 0 }, estSensible: false };
  newLieuArrivee = { nom: '', adresse: '', coordonnees: { latitude: 0, longitude: 0 }, estSensible: false };

  // Variable pour la sélection multiple des passagers
  selectedPassagersIds: string[] = [];

  // Filtrage des lieux
  showAllLieuxInPays: boolean = false;
  userProfile: string | null = null;
  userPaysId: string | null = null;
  userBaseId: string | null = null;

  // NOUVEAU : Case à cocher pour retour identique
  isRetourIdentique: boolean = false;

  onRetourIdentiqueChange(): void {
    if (this.isRetourIdentique) {
      if (this.selectedLieuDepartOption === 'existing') {
        this.selectedLieuArriveeOption = 'existing';
        this.mouvement.lieuArrivee = this.mouvement.lieuDepart;
      } else {
        // Cas complexe (nouveau lieu), on simplifie en désactivant la copie pour le "nouveau" mode
        // Ou on copie les champs newLieuDepart vers newLieuArrivee
        this.selectedLieuArriveeOption = 'new';
        this.newLieuArrivee = { ...this.newLieuDepart };
      }
    } else {
      // On reset éventuellement si l'utilisateur décoche, ou on laisse tel quel pour qu'il modifie
      this.mouvement.lieuArrivee = '';
    }
  }

  // NOUVEAU : Gestion des étapes intermédiaires
  etapes: any[] = [];

  // NOUVEAU : Estimation du trajet
  estimation: { distance: string, duration: string } | null = null;
  isCalculatingEstimation: boolean = false;

  constructor(
    private mouvementService: MouvementService,
    private utilisateurService: UtilisateurService,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService,
    private lieuService: LieuService,
    private router: Router,
    public authService: AuthService,
    private osrmService: OsrmService // NOUVEAU
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();
    this.userBaseId = this.authService.getUserBaseId();
    this.loadData();
    // Définir le demandeur automatiquement
    this.mouvement.demandeur = this.authService.getUserId() || '';
  }

  loadData(): void {
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
      (data) => {
        // Par défaut, afficher tous les lieux pour SuperAdmin
        if (this.userProfile === 'SuperAdmin') {
          this.lieux = data;
          console.log('SuperAdmin: affichage de tous les lieux');
          return;
        }

        // Pour les autres utilisateurs, filtrer par base ou pays
        if (!this.userBaseId || !this.userPaysId) {
          console.warn('⚠️ Base ou Pays non défini pour l\'utilisateur');
          this.lieux = [];
          return;
        }

        if (this.showAllLieuxInPays) {
          // Afficher tous les lieux du pays
          this.lieux = data.filter((lieu: any) => {
            const lieuPaysId = typeof lieu.pays === 'string' ? lieu.pays : lieu.pays?._id;
            return lieuPaysId === this.userPaysId;
          });
          console.log(`Affichage des lieux du pays (${this.lieux.length} lieux)`);
        } else {
          // Afficher uniquement les lieux de la base (STRICT)
          this.lieux = data.filter((lieu: any) => {
            const lieuBaseId = typeof lieu.base === 'string' ? lieu.base : lieu.base?._id;
            return lieuBaseId === this.userBaseId;
          });
          console.log(`Affichage des lieux de la base (${this.lieux.length} lieux)`);
        }
      },
      (error) => console.error('Erreur chargement lieux:', error)
    );
  }

  // Basculer l'affichage des lieux
  toggleShowAllLieuxInPays(): void {
    this.showAllLieuxInPays = !this.showAllLieuxInPays;
    this.loadData();
  }

  // Gestion des étapes
  addEtape(): void {
    this.etapes.push({ lieu: '', dateArrivee: '', dateDepart: '' });
    this.calculateEstimation();
  }

  removeEtape(index: number): void {
    this.etapes.splice(index, 1);
    this.calculateEstimation();
  }

  // NOUVEAU : Méthode de calcul d'estimation
  calculateEstimation(): void {
    // Collecter tous les IDs de lieux (Départ -> Etapes -> Arrivée)
    const lieuIds: string[] = [];

    if (this.mouvement.lieuDepart) lieuIds.push(this.mouvement.lieuDepart);

    this.etapes.forEach(e => {
      if (e.lieu) lieuIds.push(e.lieu);
    });

    if (this.mouvement.lieuArrivee) lieuIds.push(this.mouvement.lieuArrivee);

    // Il faut au moins 2 points pour calculer
    if (lieuIds.length < 2) {
      this.estimation = null;
      return;
    }

    // Récupérer les coordonnées de chaque lieu
    const waypoints: { lat: number, lng: number }[] = [];
    let valid = true;

    lieuIds.forEach(id => {
      const lieu = this.lieux.find(l => l._id === id);
      if (lieu && lieu.coordonnees) {
        let lat: number, lng: number;
        if (typeof lieu.coordonnees === 'string') {
          const parts = lieu.coordonnees.split(',').map((c: string) => parseFloat(c.trim()));
          lat = parts[0];
          lng = parts[1];
        } else {
          lat = parseFloat(lieu.coordonnees.latitude);
          lng = parseFloat(lieu.coordonnees.longitude);
        }

        if (!isNaN(lat) && !isNaN(lng)) {
          waypoints.push({ lat, lng });
        } else {
          valid = false;
        }
      } else {
        valid = false;
      }
    });

    if (!valid || waypoints.length < 2) {
      this.estimation = null;
      return;
    }

    this.isCalculatingEstimation = true;
    this.osrmService.getRoute(waypoints).subscribe({
      next: (result) => {
        this.isCalculatingEstimation = false;
        if (result) {
          // Convert distance (meters -> km) and duration (seconds -> readable)
          const km = (result.distance / 1000).toFixed(1) + ' km';

          const hours = Math.floor(result.duration / 3600);
          const minutes = Math.floor((result.duration % 3600) / 60);

          let durationStr = '';
          if (hours > 0) durationStr += `${hours}h `;
          durationStr += `${minutes} min`;

          this.estimation = { distance: km, duration: durationStr };
        } else {
          this.estimation = null;
        }
      },
      error: () => {
        this.isCalculatingEstimation = false;
        this.estimation = null;
      }
    });
  }

  // Appelé quand un lieu change dans le template
  onLieuChange(): void {
    this.calculateEstimation();
  }

  async onSubmit(): Promise<void> {
    console.log('Tentative de soumission de demande...');

    try {
      // 1. Validation de base
      if (!this.mouvement.lieuDepart || !this.mouvement.lieuArrivee || !this.mouvement.dateDepart || !this.mouvement.dateArrivee) {
        // Note exception: si on crée un nouveau lieu, lieuDepart/Arrivee peuvent être vide temporairement, 
        // mais ils seront remplis ci-dessous.
        // On vérifie les dates obligatoires
        if (!this.mouvement.dateDepart || !this.mouvement.dateArrivee) {
          alert('Veuillez renseigner les dates de départ et d\'arrivée.');
          return;
        }
      }

      // 2. Création des Lieux (si "Nouveau")
      // Gérer le nouveau lieu de départ si sélectionné
      if (this.selectedLieuDepartOption === 'new') {
        const nom = this.newLieuDepart.nom.trim();
        const adresse = this.newLieuDepart.adresse.trim();
        const lat = Number(this.newLieuDepart.coordonnees.latitude);
        const long = Number(this.newLieuDepart.coordonnees.longitude);

        if (nom === '' || adresse === '' || isNaN(lat) || isNaN(long)) {
          alert("Veuillez remplir le nom, l'adresse et entrer des nombres valides pour la Latitude et la Longitude du nouveau lieu de départ.");
          return;
        }
        this.newLieuDepart.coordonnees.latitude = lat;
        this.newLieuDepart.coordonnees.longitude = long;

        console.log('Création nouveau lieu de départ:', this.newLieuDepart);
        try {
          const newDepartLieu = await firstValueFrom(this.lieuService.addLieu(this.newLieuDepart));
          this.mouvement.lieuDepart = newDepartLieu._id;
          console.log('✅ Lieu de départ créé avec succès:', newDepartLieu._id);
        } catch (error: any) {
          console.error('❌ Erreur création lieu de départ:', error);
          const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
          alert(`Erreur lors de la création du lieu de départ: ${errorMsg}`);
          return;
        }
      }

      // Gérer le nouveau lieu d'arrivée si sélectionné
      if (this.selectedLieuArriveeOption === 'new') {
        const nom = this.newLieuArrivee.nom.trim();
        const adresse = this.newLieuArrivee.adresse.trim();
        const lat = Number(this.newLieuArrivee.coordonnees.latitude);
        const long = Number(this.newLieuArrivee.coordonnees.longitude);

        if (nom === '' || adresse === '' || isNaN(lat) || isNaN(long)) {
          alert("Veuillez remplir le nom, l'adresse et entrer des nombres valides pour la Latitude et la Longitude du nouveau lieu d'arrivée.");
          return;
        }
        this.newLieuArrivee.coordonnees.latitude = lat;
        this.newLieuArrivee.coordonnees.longitude = long;

        console.log('Création nouveau lieu d\'arrivée:', this.newLieuArrivee);
        try {
          const newArriveeLieu = await firstValueFrom(this.lieuService.addLieu(this.newLieuArrivee));
          this.mouvement.lieuArrivee = newArriveeLieu._id;
          console.log('✅ Lieu d\'arrivée créé avec succès:', newArriveeLieu._id);
        } catch (error: any) {
          console.error('❌ Erreur création lieu d\'arrivée:', error);
          const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
          alert(`Erreur lors de la création du lieu d'arrivée: ${errorMsg}`);
          return;
        }
      }

      // 3. Construction du payload avec 'stops'
      // Le backend attend 'stops' : [ { lieu, dateDepart }, { lieu }, { lieu, dateArrivee } ]
      const stops = [];

      // Stop 0: Départ
      stops.push({
        lieu: this.mouvement.lieuDepart,
        dateDepart: this.mouvement.dateDepart
      });

      // Stops intermédiaires
      this.etapes.forEach(etape => {
        if (etape.lieu) {
          const stop: any = { lieu: etape.lieu };
          if (etape.dateArrivee) stop.dateArrivee = etape.dateArrivee;
          if (etape.dateDepart) stop.dateDepart = etape.dateDepart;
          stops.push(stop);
        }
      });

      // Stop Final: Arrivée
      stops.push({
        lieu: this.mouvement.lieuArrivee,
        dateArrivee: this.mouvement.dateArrivee
      });

      // Assigner les passagers sélectionnés
      this.mouvement.passagers = this.selectedPassagersIds;

      // Préparer l'objet final à envoyer
      const payload = {
        ...this.mouvement,
        stops: stops, // <<< L'array CRUCIAL
        // Nettoyer les champs plats si besoin, ou les laisser (le backend les ignore ou les écrase via pre-save)
      };

      console.log('Soumission du mouvement avec payload:', payload);

      this.mouvementService.addMouvement(payload).subscribe(
        (response) => {
          console.log('Mouvement créé avec succès:', response);
          alert('Demande de mouvement soumise !');
          this.router.navigate(['/']); // Rediriger vers la liste des mouvements
        },
        (error) => {
          console.error('Erreur lors de la soumission de la demande:', error);
          alert('Erreur lors de la soumission du mouvement. Vérifiez la console.');
        }
      );
    } catch (error: any) {
      console.error('Erreur générale dans onSubmit (création lieu ou mouvement):', error);
      alert('Une erreur est survenue lors du processus de soumission: ' + (error.message || ''));
    }
  }
  // Helper pour obtenir les infos de sécurité d'un lieu
  getLieuSecurityInfo(lieuId: string): { level: number, label: string, color: string } | null {
    if (!lieuId) return null;
    const lieu = this.lieux.find(l => l._id === lieuId);
    if (!lieu) return null;

    // Si le lieu a un niveau défini, l'utiliser. Sinon, baser sur estSensible
    const level = lieu.niveauSecurite || (lieu.estSensible ? 3 : 1);

    let label = 'Inconnu';
    let color = '#757575'; // Gris

    switch (level) {
      case 1: label = 'Stable'; color = '#4CAF50'; break; // Vert
      case 2: label = 'Modéré'; color = '#FFC107'; break; // Jaune
      case 3: label = 'Difficile'; color = '#FF9800'; break; // Orange
      case 4: label = 'Élevé'; color = '#F44336'; break; // Rouge
      case 5: label = 'Extrême'; color = '#212121'; break; // Noir
    }

    return { level, label, color };
  }

  // Calcul du niveau max du trajet (pour info utilisateur)
  getMaxSecurityLevel(): { level: number, label: string, color: string } | null {
    let maxLevel = 0;
    let maxInfo = null;

    // Vérifier depart et arrivée
    const idsToCheck = [];
    if (this.mouvement.lieuDepart) idsToCheck.push(this.mouvement.lieuDepart);
    if (this.mouvement.lieuArrivee) idsToCheck.push(this.mouvement.lieuArrivee);

    // Vérifier les étapes
    if (this.etapes) {
      this.etapes.forEach(e => {
        if (e.lieu) idsToCheck.push(e.lieu);
      });
    }

    idsToCheck.forEach(id => {
      const info = this.getLieuSecurityInfo(id);
      if (info && info.level > maxLevel) {
        maxLevel = info.level;
        maxInfo = info;
      }
    });

    return maxInfo;
  }
}
