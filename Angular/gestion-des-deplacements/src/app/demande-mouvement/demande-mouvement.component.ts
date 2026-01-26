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

import { MatIconModule } from '@angular/material/icon'; // Fix Build error

@Component({
  selector: 'app-demande-mouvement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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
          const durationSeconds = result.duration;

          const hours = Math.floor(durationSeconds / 3600);
          const minutes = Math.floor((durationSeconds % 3600) / 60);

          let durationStr = '';
          if (hours > 0) durationStr += `${hours}h `;
          durationStr += `${minutes} min`;

          this.estimation = { distance: km, duration: durationStr };

          // AUTO-FILL Arrival Date
          this.updateArrivalDate(durationSeconds);
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

  // NOUVEAU: Mettre à jour la date d'arrivée basés sur la durée estimée + marge
  updateArrivalDate(durationSeconds?: number): void {
    if (!this.mouvement.dateDepart) return;

    // Si durationSeconds n'est pas fourni, essayer de le récupérer d'une estimation précédente stockée ? 
    // Pour l'instant, on ne le stocke pas en raw, donc on ne fait rien si pas fourni, 
    // SAUF si on relance le calcul complet (ce qui est le cas avec onLieuChange).
    // Mais si on change JUSTE la date de départ, il nous faut la durée.
    // Simplification: on relance calculateEstimation() si la date de départ change ? 
    // Non, c'est coûteux en API. On devrait stocker durationSeconds.

    // Stockons la durée brute pour réutilisation
    if (durationSeconds) {
      (this.estimation as any).rawDuration = durationSeconds;
    } else if (this.estimation && (this.estimation as any).rawDuration) {
      durationSeconds = (this.estimation as any).rawDuration;
    } else {
      return;
    }

    if (!durationSeconds) return;

    const depart = new Date(this.mouvement.dateDepart);
    if (isNaN(depart.getTime())) return;

    // Ajouter marge de 20% (x1.2)
    let estimatedDuration = durationSeconds * 1.2;

    // Minimum 15 minutes (900 secondes) de marge/trajet si c'est très court
    if (estimatedDuration < durationSeconds + 900) {
      estimatedDuration = durationSeconds + 900;
    }

    const arrivee = new Date(depart.getTime() + (estimatedDuration * 1000));

    // Formater pour l'input datetime-local (YYYY-MM-DDTHH:mm)
    // Attention au fuseau horaire local
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const year = arrivee.getFullYear();
    const month = pad(arrivee.getMonth() + 1);
    const day = pad(arrivee.getDate());
    const hours = pad(arrivee.getHours());
    const minutes = pad(arrivee.getMinutes());

    this.mouvement.dateArrivee = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Appelé quand un lieu change dans le template
  onLieuChange(): void {
    this.calculateEstimation();
  }

  // Appelé quand la date de départ change
  onDateDepartChange(): void {
    // Mettre à jour l'arrivée si une estimation existe déjà
    this.updateArrivalDate();
  }

  // NOUVEAU : Récurrence
  isRecurring: boolean = false;
  recurrenceFrequency: 'Daily' | 'Weekly' = 'Daily';
  recurrenceEndDate: string = '';

  async onSubmit(): Promise<void> {
    console.log('Tentative de soumission de demande...');

    try {
      // 1. Validation de base
      if (!this.mouvement.lieuDepart || !this.mouvement.lieuArrivee || !this.mouvement.dateDepart || !this.mouvement.dateArrivee) {
        if (!this.mouvement.dateDepart || !this.mouvement.dateArrivee) {
          alert('Veuillez renseigner les dates de départ et d\'arrivée.');
          return;
        }
      }

      // 1.1 Validation Récurrence
      if (this.isRecurring) {
        if (!this.recurrenceEndDate) {
          alert('Veuillez spécifier une date de fin pour la récurrence.');
          return;
        }
        const startDate = new Date(this.mouvement.dateDepart);
        const endDate = new Date(this.recurrenceEndDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (endDate <= startDate) {
          alert('La date de fin de récurrence doit être postérieure à la date de départ.');
          return;
        }

        if (diffDays > 90) { // Approx 3 mois
          alert('La récurrence ne peut pas dépasser 3 mois.');
          return;
        }
      }

      // 2. Création des Lieux (si "Nouveau") - IDENTIQUE
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

        try {
          const newDepartLieu = await firstValueFrom(this.lieuService.addLieu(this.newLieuDepart));
          this.mouvement.lieuDepart = newDepartLieu._id;
          // IMPORTANT: Switch to existing to avoid recreating for every recurrence loop
          this.selectedLieuDepartOption = 'existing';
        } catch (error: any) {
          console.error('Erreur creation lieu depart', error); throw error;
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

        try {
          const newArriveeLieu = await firstValueFrom(this.lieuService.addLieu(this.newLieuArrivee));
          this.mouvement.lieuArrivee = newArriveeLieu._id;
          // IMPORTANT: Switch to existing
          this.selectedLieuArriveeOption = 'existing';
        } catch (error: any) {
          console.error('Erreur creation lieu arrivee', error); throw error;
        }
      }

      // 3. BOUCLE DE RÉCURRENCE OU SIMPLE ENVOI
      const requests = [];
      let currentDate = new Date(this.mouvement.dateDepart);
      // Calculer durée trajet pour repliquer l'arrivée
      const arrivalDateOrigin = new Date(this.mouvement.dateArrivee);
      const tripDurationMs = arrivalDateOrigin.getTime() - currentDate.getTime();

      let endDateLoop = this.isRecurring ? new Date(this.recurrenceEndDate) : new Date(this.mouvement.dateDepart);
      // Set hours for strict comparison logic if needed, but simple loop is fine.

      // Safety limit
      let safeGuard = 0;

      do {
        // Prepare payload for THIS iteration
        const currentDepartStr = currentDate.toISOString(); // Or format correctly for backend?
        // Attention: input datetime-local gives 'YYYY-MM-DDTHH:mm', Date.toISOString gives 'YYYY-MM-DDTHH:mm:ss.sssZ'
        // Backend likely handles ISO or Date objects. Assuming standard Date handling.
        // BUT: Components use strings for inputs...
        // Let's reconstruct the string format needed if backend expects specific string.
        // Assuming backend handles ISO strings fine (Mongoose Date).

        const currentArriveeDate = new Date(currentDate.getTime() + tripDurationMs);

        const stops = [];

        // Helper to format date for backend/consistency if needed, or just use date object
        // The service addMouvement expects payload matching Mouvement model.

        stops.push({
          lieu: this.mouvement.lieuDepart,
          dateDepart: currentDate
        });

        // Stops intermédiaires (Dates need shifting too!)
        // For simplicity in MVP Recurrence: We might ignore intermediate stop dates shifting logic or assume they are relative.
        // CURRENT LOGIC: Recurrence copies structure but updating intermediate dates is complex without duration data per leg.
        // SIMPLIFICATION: We only shift start/end of the whole trip. Intermediate stops keep "same time of day" ? 
        // Implementation: Shift intermediate dates by same delta as start date.
        const timeDelta = currentDate.getTime() - (new Date(this.mouvement.dateDepart)).getTime();

        this.etapes.forEach(etape => {
          if (etape.lieu) {
            const s: any = { lieu: etape.lieu };
            if (etape.dateArrivee) s.dateArrivee = new Date(new Date(etape.dateArrivee).getTime() + timeDelta);
            if (etape.dateDepart) s.dateDepart = new Date(new Date(etape.dateDepart).getTime() + timeDelta);
            stops.push(s);
          }
        });

        stops.push({
          lieu: this.mouvement.lieuArrivee,
          dateArrivee: currentArriveeDate
        });

        this.mouvement.passagers = this.selectedPassagersIds;

        const payload = {
          ...this.mouvement,
          dateDepart: currentDate,
          dateArrivee: currentArriveeDate,
          stops: stops,
          recurrenceGroupId: this.isRecurring ? 'REC_' + Date.now() : null // Optional: marking them
        };

        requests.push(this.mouvementService.addMouvement(payload));

        // INCREMENT DATE
        if (this.recurrenceFrequency === 'Daily') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else {
          currentDate.setDate(currentDate.getDate() + 7);
        }
        safeGuard++;
      } while (this.isRecurring && currentDate <= endDateLoop && safeGuard < 100);

      // Execute All
      if (requests.length > 0) {
        // Use forkJoin logic via firstValueFrom checking
        // Since we pushed Observables, we can use forkJoin
        const { forkJoin } = await import('rxjs');
        await firstValueFrom(forkJoin(requests));

        console.log(`${requests.length} mouvements créés.`);
        alert(this.isRecurring ? `${requests.length} demandes de mouvement récurrentes créées !` : 'Demande de mouvement soumise !');
        this.router.navigate(['/']);
      }

    } catch (error: any) {
      console.error('Erreur générale dans onSubmit:', error);
      alert('Une erreur est survenue: ' + (error.message || ''));
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
