import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MouvementService } from '../mouvement.service';
import { VehiculeService } from '../vehicule.service';
import { UtilisateurService } from '../utilisateur.service';
import { AuthService } from '../auth.service';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-consolidation-mouvements',
  standalone: true,
  imports: [CommonModule, FormsModule, MapMouvementsComponent, MatIconModule],
  templateUrl: './consolidation-mouvements.component.html',
  styleUrls: ['./consolidation-mouvements.component.css']
})
export class ConsolidationMouvementsComponent implements OnInit {
  mouvementsValides: any[] = [];
  mouvementsConsolides: any[] = [];
  filteredMouvementsConsolides: any[] = [];

  vehicules: any[] = [];
  chauffeurs: any[] = [];

  selectedMouvementId: string | null = null;
  selectedVehiculeId: string = '';
  selectedChauffeurId: string = '';

  mapEvents: any[] = [];
  mouvementsToShowOnMap: any[] = [];

  mouvementsToRegroup: any[] = [];

  showConsolidesHistory: boolean = false;
  filterStartDate: string = '';
  filterEndDate: string = '';

  mouvementEnSelection: any = null;
  suggestedMouvements: any[] = [];

  // Filtrage par base
  userProfile: string | null = null;
  userBaseId: string | null = null;

  constructor(
    private mouvementService: MouvementService,
    private vehiculeService: VehiculeService,
    private utilisateurService: UtilisateurService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userBaseId = this.authService.getUserBaseId();
    this.loadDataForConsolidation();
  }

  loadDataForConsolidation(): void {
    forkJoin({
      mouvements: this.mouvementService.getMouvements(),
      vehicules: this.vehiculeService.getVehicules(),
      utilisateurs: this.utilisateurService.getUtilisateurs()
    }).subscribe(
      ({ mouvements, vehicules, utilisateurs }) => {
        this.vehicules = vehicules;

        // Filtrer les utilisateurs pour ne garder que ceux avec le profil 'Chauffeur'
        let chauffeurs = utilisateurs.filter((u: any) =>
          u.profil && u.profil.toLowerCase() === 'chauffeur'
        );

        // Filtrer par base si pas SuperAdmin
        if (this.userProfile !== 'SuperAdmin' && this.userBaseId) {
          this.chauffeurs = chauffeurs.filter((c: any) => c.base === this.userBaseId);
        } else {
          this.chauffeurs = chauffeurs;
        }

        console.log('Chauffeurs chargés pour cette base:', this.chauffeurs.length);

        // Filtrer les mouvements "validés" qui n'ont pas encore de véhicule/chauffeur affecté
        this.mouvementsValides = mouvements.filter(m =>
          m.statut === 'validé' && (!m.vehicule || !m.chauffeur) && m.stops && m.stops.length > 0
        );

        // Charger tous les mouvements consolidés/affectés pour l'historique
        this.mouvementsConsolides = mouvements.filter(m =>
          (m.statut === 'validé' || m.statut === 'pris en charge' || m.statut === 'en cours' || m.statut === 'regroupé' || m.statut === 'regroupé-enfant' || m.statut === 'terminé') && m.stops && m.stops.length > 0
        );
        this.applyConsolidesFilters();

        // Au chargement, tous les mouvements valides sont affichés sur la carte par défaut
        this.mouvementsToShowOnMap = [...this.mouvementsValides];
        this.updateMapEvents(this.mouvementsToShowOnMap);
      },
      (error) => console.error('Erreur chargement données de consolidation:', error)
    );
  }

  applyConsolidesFilters(): void {
    this.filteredMouvementsConsolides = this.mouvementsConsolides.filter(mouvement => {
      const mouvementStartDate = new Date(this.getFirstDateDepart(mouvement));
      const mouvementEndDate = new Date(this.getLastDateArrivee(mouvement));

      let passesFilter = true;

      if (this.filterStartDate) {
        const filterStart = new Date(this.filterStartDate);
        if (mouvementStartDate > filterStart) passesFilter = false;
      }

      if (this.filterEndDate) {
        const filterEnd = new Date(this.filterEndDate);
        if (mouvementEndDate < filterEnd) passesFilter = false;
      }

      return passesFilter;
    });
  }

  updateMapEvents(mouvementsList: any[]): void {
    this.mapEvents = mouvementsList.filter(mouvement =>
      mouvement.stops && mouvement.stops.length > 0 &&
      mouvement.stops.every((stop: any) =>
        stop.lieu?.coordonnees &&
        typeof stop.lieu.coordonnees.latitude === 'number' &&
        typeof stop.lieu.coordonnees.longitude === 'number'
      )
    ).map(mouvement => ({
      id: mouvement._id,
      title: mouvement.objectif,
      demandeur: mouvement.demandeur?.nom,
      stops: mouvement.stops.map((stop: any) => ({
        lieuId: stop.lieu._id,
        nom: stop.lieu.nom,
        adresse: stop.lieu.adresse,
        lat: stop.lieu.coordonnees.latitude,
        lng: stop.lieu.coordonnees.longitude,
        dateDepart: stop.dateDepart,
        dateArrivee: stop.dateArrivee
      }))
    }));
  }

  onToggleMapDisplay(event: any, mouvement: any): void {
    if (event.target.checked) {
      if (!this.mouvementsToShowOnMap.some(m => m._id === mouvement._id)) {
        this.mouvementsToShowOnMap.push(mouvement);
      }
    } else {
      this.mouvementsToShowOnMap = this.mouvementsToShowOnMap.filter(m => m._id !== mouvement._id);
    }
    this.updateMapEvents(this.mouvementsToShowOnMap);
  }

  isMouvementSelectedForMap(mouvementId: string): boolean {
    return this.mouvementsToShowOnMap.some(m => m._id === mouvementId);
  }

  onCheckboxChange(event: any, mouvement: any): void {
    if (event.target.checked) {
      this.mouvementsToRegroup.push(mouvement);
    } else {
      this.mouvementsToRegroup = this.mouvementsToRegroup.filter(m => m._id !== mouvement._id);
    }
  }

  regrouperMouvementsSelectionnes(): void {
    if (this.mouvementsToRegroup.length < 2) {
      alert('Veuillez sélectionner au moins deux mouvements pour le regroupement.');
      return;
    }
    if (!confirm(`Voulez-vous regrouper ${this.mouvementsToRegroup.length} mouvements ?`)) {
      return;
    }

    const firstMouvement = this.mouvementsToRegroup[0];
    const regroupedTitle = `Regroupement pour ${this.mouvementsToRegroup.length} mouvements`;
    const allPassagersIds = Array.from(new Set(this.mouvementsToRegroup.flatMap(m => m.passagers.map((p: any) => p._id))));

    const regroupementData = {
      stops: firstMouvement.stops,
      demandeur: firstMouvement.demandeur._id,
      objectif: regroupedTitle,
      statut: 'regroupé',
      passagers: allPassagersIds,
      enfantsMouvements: this.mouvementsToRegroup.map(m => m._id)
    };

    this.mouvementService.addMouvement(regroupementData).subscribe(
      (newRegroupedMouvement) => {
        alert('Mouvement de regroupement créé !');
        const updatePromises = this.mouvementsToRegroup.map(m => {
          return firstValueFrom(this.mouvementService.updateMouvement(m._id, {
            statut: 'regroupé-enfant'
          }));
        });

        forkJoin(updatePromises).subscribe(
          () => {
            alert('Mouvements regroupés.');
            this.mouvementsToRegroup = [];
            this.loadDataForConsolidation();
          },
          (error) => console.error('Erreur update enfants:', error)
        );
      },
      (error) => console.error('Erreur création regroupement:', error)
    );
  }

  loadVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(
      (data) => this.vehicules = data,
      (error) => console.error('Erreur chargement véhicules:', error)
    );
  }

  selectMouvementForAssignment(mouvement: any): void {
    this.selectedMouvementId = mouvement._id;
    this.selectedVehiculeId = mouvement.vehicule?._id || '';
    this.selectedChauffeurId = mouvement.chauffeur?._id || '';
    this.mouvementEnSelection = mouvement;

    this.mouvementService.getMouvementSuggestions(mouvement._id).subscribe(
      (data: any[]) => this.suggestedMouvements = data,
      (error: any) => console.error('Erreur chargement suggestions:', error)
    );
  }

  async assignVehiculeAndChauffeur(): Promise<void> {
    if (!this.selectedMouvementId || !this.selectedVehiculeId || !this.selectedChauffeurId) {
      alert('Veuillez sélectionner un mouvement, un véhicule et un chauffeur.');
      return;
    }

    const assignmentData = {
      vehicule: this.selectedVehiculeId,
      chauffeur: this.selectedChauffeurId
      // IMPORTANT: On ne change PAS le statut à 'en cours' ici
      // Le statut reste 'validé' pour que le chauffeur puisse le prendre en charge dans e-logbook
    };

    try {
      await firstValueFrom(this.mouvementService.updateMouvement(this.selectedMouvementId, assignmentData));
      alert('Affectation réussie !');
      this.selectedMouvementId = null;
      this.selectedVehiculeId = '';
      this.selectedChauffeurId = '';
      this.loadDataForConsolidation();
    } catch (error: any) {
      console.error('Erreur affectation:', error);
      alert('Erreur lors de l\'affectation.');
    }
  }

  cancelAssignment(): void {
    this.selectedMouvementId = null;
    this.selectedVehiculeId = '';
    this.selectedChauffeurId = '';
    this.mouvementEnSelection = null;
    this.suggestedMouvements = [];
  }

  getPassagersNoms(mouvement: any): string {
    if (mouvement.passagers && mouvement.passagers.length > 0) {
      return mouvement.passagers.map((p: any) => p.nom).join(', ');
    }
    return 'Aucun';
  }

  getFinalDestination(mouvement: any): string {
    if (mouvement.stops && mouvement.stops.length > 0 && mouvement.stops[mouvement.stops.length - 1].lieu) {
      return `${mouvement.stops[mouvement.stops.length - 1].lieu.nom} (${mouvement.stops[mouvement.stops.length - 1].lieu.adresse})`;
    }
    return 'N/A';
  }

  getOrigin(mouvement: any): string {
    if (mouvement.stops && mouvement.stops.length > 0 && mouvement.stops[0].lieu) {
      return `${mouvement.stops[0].lieu.nom} (${mouvement.stops[0].lieu.adresse})`;
    }
    return 'N/A';
  }

  getFirstDateDepart(mouvement: any): string {
    if (mouvement.stops && mouvement.stops.length > 0 && mouvement.stops[0].dateDepart) {
      return mouvement.stops[0].dateDepart;
    }
    return '';
  }

  getLastDateArrivee(mouvement: any): string {
    if (mouvement.stops && mouvement.stops.length > 0 && mouvement.stops[mouvement.stops.length - 1].dateArrivee) {
      return mouvement.stops[mouvement.stops.length - 1].dateArrivee;
    }
    return '';
  }
}
