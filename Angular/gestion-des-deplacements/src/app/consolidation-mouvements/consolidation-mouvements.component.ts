import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MouvementService } from '../mouvement.service';
import { VehiculeService } from '../vehicule.service';
import { UtilisateurService } from '../utilisateur.service';
import { LieuService } from '../lieu.service';
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

  // NOUVEAU: Mode d'édition pour la consolidation
  isEditingConsolidation: boolean = false;
  consolidationStops: any[] = [];
  consolidationData: any = null;
  consolidationMapEvents: any[] = [];
  lieux: any[] = []; // NOUVEAU: Liste des lieux disponibles pour modification

  constructor(
    private mouvementService: MouvementService,
    private vehiculeService: VehiculeService,
    private utilisateurService: UtilisateurService,
    private lieuService: LieuService,
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
        // IMPORTANT: Exclure les mouvements "regroupé" (mouvements enfants) ET Aérien/Maritime
        this.mouvementsValides = mouvements.filter(m =>
          m.statut === 'validé' && (!m.vehicule || !m.chauffeur) && m.stops && m.stops.length > 0 &&
          (m.modeTransport === 'Routier' || !m.modeTransport) // Par défaut Routier si non défini
        );

        // Charger tous les mouvements consolidés/affectés pour l'historique
        // IMPORTANT: Inclure 'regroupé' dans l'historique uniquement
        this.mouvementsConsolides = mouvements.filter(m =>
          (m.statut === 'validé' || m.statut === 'pris en charge' || m.statut === 'en cours' || m.statut === 'regroupé' || m.statut === 'terminé') && m.stops && m.stops.length > 0
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

    console.log('🔄 [CONSOLIDATION] Début du regroupement de', this.mouvementsToRegroup.length, 'mouvements');

    // Charger les lieux disponibles pour modification
    this.loadLieux();

    // Fusionner tous les stops de tous les mouvements
    this.consolidationStops = this.mergeStopsFromMovements(this.mouvementsToRegroup);
    console.log('🔄 [CONSOLIDATION] Stops fusionnés:', this.consolidationStops.length);

    // Préparer les données de consolidation
    const allPassagersIds = Array.from(new Set(
      this.mouvementsToRegroup.flatMap(m => m.passagers.map((p: any) => p._id))
    ));

    this.consolidationData = {
      objectif: `Regroupement pour ${this.mouvementsToRegroup.length} mouvements`,
      passagers: allPassagersIds,
      demandeur: this.mouvementsToRegroup[0].demandeur._id,
      enfantsMouvements: this.mouvementsToRegroup.map(m => m._id)
    };

    // NOUVEAU: Préparer la carte pour visualisation
    this.updateConsolidationMap();

    // Activer le mode édition
    this.isEditingConsolidation = true;
  }

  mergeStopsFromMovements(mouvements: any[]): any[] {
    const allStops: any[] = [];

    mouvements.forEach(mouvement => {
      mouvement.stops.forEach((stop: any, index: number) => {
        allStops.push({
          lieu: stop.lieu,
          dateArrivee: stop.dateArrivee ? this.formatDateForInput(stop.dateArrivee) : '',
          dateDepart: stop.dateDepart ? this.formatDateForInput(stop.dateDepart) : '',
          originMouvement: mouvement._id,
          originMouvementObjectif: mouvement.objectif,
          isFirstStop: index === 0,
          isLastStop: index === mouvement.stops.length - 1
        });
      });
    });

    console.log('🔄 [CONSOLIDATION] Stops avant tri:', allStops.length);

    // Trier par date de départ
    allStops.sort((a, b) => {
      const dateA = new Date(a.dateDepart || a.dateArrivee);
      const dateB = new Date(b.dateDepart || b.dateArrivee);
      return dateA.getTime() - dateB.getTime();
    });

    // Dédupliquer les lieux identiques consécutifs
    const deduplicatedStops = [];
    for (let i = 0; i < allStops.length; i++) {
      if (i === 0 || allStops[i].lieu._id !== allStops[i - 1].lieu._id) {
        deduplicatedStops.push(allStops[i]);
      } else {
        console.log('🔄 [CONSOLIDATION] Lieu dupliqué ignoré:', allStops[i].lieu.nom);
      }
    }

    console.log('🔄 [CONSOLIDATION] Stops après déduplication:', deduplicatedStops.length);
    return deduplicatedStops;
  }

  formatDateForInput(dateString: string): string {
    // Convertir la date au format datetime-local (YYYY-MM-DDTHH:mm)
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  confirmConsolidation(): void {
    console.log('✅ [CONSOLIDATION] Confirmation de la consolidation');

    const regroupementData = {
      stops: this.consolidationStops.map(stop => ({
        lieu: stop.lieu._id,
        dateArrivee: stop.dateArrivee ? new Date(stop.dateArrivee).toISOString() : undefined,
        dateDepart: stop.dateDepart ? new Date(stop.dateDepart).toISOString() : undefined,
        originMouvement: stop.originMouvement
      })),
      demandeur: this.consolidationData.demandeur,
      objectif: this.consolidationData.objectif,
      statut: 'validé', // IMPORTANT: Garder le statut validé, pas de re-validation
      passagers: this.consolidationData.passagers,
      enfantsMouvements: this.consolidationData.enfantsMouvements
    };

    console.log('✅ [CONSOLIDATION] Données à envoyer:', regroupementData);

    this.mouvementService.addMouvement(regroupementData).subscribe(
      (newRegroupedMouvement) => {
        console.log('✅ [CONSOLIDATION] Mouvement consolidé créé:', newRegroupedMouvement._id);

        // Mettre à jour les mouvements enfants
        // IMPORTANT: Utiliser le statut 'regroupé' au lieu de 'regroupé-enfant'
        const updatePromises = this.mouvementsToRegroup.map(m => {
          return firstValueFrom(this.mouvementService.updateMouvement(m._id, {
            statut: 'regroupé',
            parentMouvement: newRegroupedMouvement._id
          }));
        });

        forkJoin(updatePromises).subscribe(
          () => {
            alert('Mouvements regroupés avec succès !');
            this.cancelConsolidation();
            this.loadDataForConsolidation();
          },
          (error) => {
            console.error('❌ [CONSOLIDATION] Erreur update enfants:', error);
            alert('Erreur lors de la mise à jour des mouvements enfants.');
          }
        );
      },
      (error) => {
        console.error('❌ [CONSOLIDATION] Erreur création regroupement:', error);
        alert('Erreur lors de la création du mouvement consolidé.');
      }
    );
  }

  cancelConsolidation(): void {
    this.isEditingConsolidation = false;
    this.consolidationStops = [];
    this.consolidationData = null;
    this.consolidationMapEvents = [];
    this.mouvementsToRegroup = [];
  }

  updateConsolidationMap(): void {
    // Créer un événement de carte temporaire avec les stops consolidés
    const validStops = this.consolidationStops.filter(stop =>
      stop.lieu?.coordonnees &&
      typeof stop.lieu.coordonnees.latitude === 'number' &&
      typeof stop.lieu.coordonnees.longitude === 'number'
    );

    if (validStops.length > 0) {
      this.consolidationMapEvents = [{
        id: 'consolidation-preview',
        title: this.consolidationData.objectif,
        demandeur: 'Aperçu consolidation',
        stops: validStops.map((stop: any) => ({
          lieuId: stop.lieu._id,
          nom: stop.lieu.nom,
          adresse: stop.lieu.adresse,
          lat: stop.lieu.coordonnees.latitude,
          lng: stop.lieu.coordonnees.longitude,
          dateDepart: stop.dateDepart,
          dateArrivee: stop.dateArrivee
        }))
      }];
      console.log('🗺️ [CONSOLIDATION] Carte mise à jour avec', validStops.length, 'stops');
    }
  }

  onConsolidationDateChange(): void {
    // Mettre à jour la carte quand les dates changent
    this.updateConsolidationMap();
  }

  // NOUVEAU: Gestion des étapes
  moveStopUp(index: number): void {
    if (index > 0) {
      const temp = this.consolidationStops[index];
      this.consolidationStops[index] = this.consolidationStops[index - 1];
      this.consolidationStops[index - 1] = temp;
      this.updateConsolidationMap();
      console.log('🔄 [CONSOLIDATION] Étape déplacée vers le haut');
    }
  }

  moveStopDown(index: number): void {
    if (index < this.consolidationStops.length - 1) {
      const temp = this.consolidationStops[index];
      this.consolidationStops[index] = this.consolidationStops[index + 1];
      this.consolidationStops[index + 1] = temp;
      this.updateConsolidationMap();
      console.log('🔄 [CONSOLIDATION] Étape déplacée vers le bas');
    }
  }

  removeStop(index: number): void {
    if (this.consolidationStops.length <= 2) {
      alert('Un mouvement doit avoir au moins 2 étapes (départ et arrivée).');
      return;
    }
    if (confirm(`Voulez-vous vraiment supprimer l'étape "${this.consolidationStops[index].lieu.nom}" ?`)) {
      this.consolidationStops.splice(index, 1);
      this.updateConsolidationMap();
      console.log('🗑️ [CONSOLIDATION] Étape supprimée');
    }
  }

  changeStopLocation(index: number, newLieuId: string): void {
    const newLieu = this.lieux.find(l => l._id === newLieuId);
    if (newLieu) {
      this.consolidationStops[index].lieu = newLieu;
      this.updateConsolidationMap();
      console.log('📍 [CONSOLIDATION] Lieu modifié:', newLieu.nom);
    }
  }

  loadLieux(): void {
    this.lieuService.getLieux().subscribe(
      (data) => {
        this.lieux = data;
        console.log('📍 [CONSOLIDATION] Lieux chargés:', this.lieux.length);
      },
      (error) => console.error('❌ [CONSOLIDATION] Erreur chargement lieux:', error)
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

  // NETTOYAGE DES FANTÔMES (ADMIN)
  cleanGhosts(): void {
    if (!confirm('⚠️ ATTENTION : Cette action va scanner et supprimer tous les mouvements "regroupés" orphelins (dont le parent n\'existe plus). Êtes-vous sûr de vouloir continuer ?')) {
      return;
    }

    console.log('🧹 [CLEANUP] Lancement du nettoyage manuel...');
    this.mouvementService.cleanGhosts().subscribe(
      (response) => {
        console.log('✅ [CLEANUP] Résultat:', response);
        alert(`Nettoyage terminé !\n${response.deletedCount} mouvements fantômes supprimés.`);
        this.loadDataForConsolidation(); // Recharger pour voir la différence
      },
      (error) => {
        console.error('❌ [CLEANUP] Erreur:', error);
        alert('Erreur lors du nettoyage : ' + (error.error?.message || error.message));
      }
    );
  }

  // NOUVEAU: Valider un trajet ad-hoc
  validerAdHoc(mouvement: any): void {
    if (confirm('Valider ce trajet imprévu ? Il sera à fait intégré comme un trajet normal.')) {
      this.mouvementService.updateMouvement(mouvement._id, { isAdHoc: false }).subscribe(
        () => {
          alert('Trajet validé !');
          this.loadDataForConsolidation();
        },
        (error) => {
          console.error('Erreur validation ad-hoc:', error);
          alert('Erreur lors de la validation.');
        }
      );
    }
  }
}
