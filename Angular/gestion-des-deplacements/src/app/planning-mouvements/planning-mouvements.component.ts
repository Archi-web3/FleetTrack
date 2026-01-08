import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouvementService } from '../mouvement.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// Imports pour angular-calendar
import {
  CalendarModule,
  CalendarWeekViewComponent,
  CalendarDateFormatter,
  DateAdapter,
  CalendarNativeDateFormatter,
  DateFormatterParams
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { addDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Subject } from 'rxjs';

// Custom Date Formatter for French
@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return format(date, 'EEEE d', { locale: fr });
  }
  public override weekViewTitle({ date, locale }: DateFormatterParams): string {
    return format(date, 'MMM yyyy', { locale: fr });
  }
}

@Component({
  selector: 'app-planning-mouvements',
  standalone: true,
  imports: [CommonModule, CalendarModule, CalendarWeekViewComponent, MapMouvementsComponent, MatButtonModule, MatTooltipModule],
  templateUrl: './planning-mouvements.component.html',
  styleUrls: ['./planning-mouvements.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
})
export class PlanningMouvementsComponent implements OnInit {
  viewDate: Date = new Date();
  view: string = 'week';
  events: any[] = [];
  mapEvents: any[] = [];
  locale: string = 'fr';
  refresh: Subject<any> = new Subject();
  userProfile: string | null = null;

  constructor(
    private mouvementService: MouvementService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userProfile = this.authService.getUserProfile();
    this.getPlanningMouvements();
  }

  getPlanningMouvements() {
    this.mouvementService.getPlanningMouvements().subscribe(
      (data: any[]) => {
        // Calculer le début et la fin de la semaine en cours
        const startOfCurrentWeek = this.getStartOfWeek(this.viewDate);
        const endOfCurrentWeek = this.getEndOfWeek(this.viewDate);

        console.log('📅 Semaine affichée:', {
          debut: startOfCurrentWeek,
          fin: endOfCurrentWeek
        });

        // Préparer les événements pour la carte - FILTRER PAR SEMAINE EN COURS
        this.mapEvents = data.filter((m: any) => {
          // Vérifier que le mouvement a des stops valides
          if (!m.stops || m.stops.length === 0 || !m.stops.every((stop: any) => stop.lieu && stop.lieu.coordonnees)) {
            return false;
          }

          // Vérifier que le mouvement se déroule pendant la semaine en cours
          const mouvementStart = new Date(m.dateDepart);
          const mouvementEnd = new Date(m.dateArrivee);

          // Le mouvement est dans la semaine si :
          // - Il commence avant la fin de la semaine ET
          // - Il se termine après le début de la semaine
          const isInCurrentWeek = mouvementStart <= endOfCurrentWeek && mouvementEnd >= startOfCurrentWeek;

          if (isInCurrentWeek) {
            console.log('✅ Mouvement dans la semaine:', m.objectif, {
              debut: mouvementStart,
              fin: mouvementEnd
            });
          }

          return isInCurrentWeek;
        }).map((m: any) => ({
          id: m._id,
          title: m.objectif,
          demandeur: m.demandeur?.nom,
          vehicule: m.vehicule,
          chauffeur: m.chauffeur,
          stops: m.stops.map((stop: any) => ({
            lieuId: stop.lieu._id,
            nom: stop.lieu.nom,
            adresse: stop.lieu.adresse,
            lat: stop.lieu.coordonnees.latitude,
            lng: stop.lieu.coordonnees.longitude,
            dateDepart: stop.dateDepart,
            dateArrivee: stop.dateArrivee
          }))
        }));

        console.log('🗺️ Mouvements affichés sur la carte:', this.mapEvents.length);

        this.events = data.map((mouvement: any) => {
          // Générer le titre simplifié et le tooltip détaillé
          const title = this.getEventTitle(mouvement);
          const tooltip = this.getEventTooltip(mouvement);
          const colors = this.getColorByStatus(mouvement.statut);

          return {
            start: new Date(mouvement.dateDepart),
            end: new Date(mouvement.dateArrivee),
            title: title,
            color: colors,
            allDay: false,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
            meta: {
              ...mouvement,
              tooltip: tooltip // Ajouter le tooltip dans meta
            }
          };
        });
        this.refresh.next(true);
        console.log("Planning des mouvements chargé avec carte:", this.events);
      },
      (error: any) => {
        console.error('Erreur chargement planning des mouvements:', error);
      }
    );
  }

  // NOUVEAU: Générer un titre simplifié pour l'événement
  getEventTitle(mouvement: any): string {
    // Récupérer la destination (dernier stop)
    let destination = 'Destination inconnue';
    if (mouvement.stops && mouvement.stops.length > 0) {
      const lastStop = mouvement.stops[mouvement.stops.length - 1];
      destination = lastStop.lieu?.nom || 'Destination inconnue';
    }

    // Pour les mouvements regroupés, afficher max 2 destinations
    if (mouvement.statut === 'regroupé' && mouvement.enfantsMouvements && mouvement.enfantsMouvements.length > 0) {
      const destinations: string[] = [];

      // Ajouter la destination du mouvement parent
      destinations.push(destination);

      // Ajouter les destinations des enfants (max 1 de plus pour avoir 2 au total)
      for (let i = 0; i < Math.min(1, mouvement.enfantsMouvements.length); i++) {
        const enfant = mouvement.enfantsMouvements[i];
        if (enfant.stops && enfant.stops.length > 0) {
          const enfantDest = enfant.stops[enfant.stops.length - 1].lieu?.nom;
          if (enfantDest && !destinations.includes(enfantDest)) {
            destinations.push(enfantDest);
          }
        }
      }

      destination = destinations.slice(0, 2).join(' + ');
      if (mouvement.enfantsMouvements.length > 1) {
        destination += ` (+${mouvement.enfantsMouvements.length - 1})`;
      }
    }

    // Récupérer le véhicule
    const vehicule = mouvement.vehicule
      ? `Véh. ${mouvement.vehicule.immatriculation || mouvement.vehicule.marque}`
      : 'Pas de véhicule';

    // Récupérer le chauffeur
    const chauffeur = mouvement.chauffeur
      ? `${mouvement.chauffeur.prenom} ${mouvement.chauffeur.nom}`
      : 'Pas de chauffeur';

    return `${destination} • ${vehicule} • ${chauffeur}`;
  }

  // NOUVEAU: Générer un tooltip détaillé pour l'événement
  getEventTooltip(mouvement: any): string {
    const lines: string[] = [];

    // Objectif
    lines.push(`📍 Objectif: ${mouvement.objectif || 'Non spécifié'}`);

    // Horaires
    const heureDepart = mouvement.dateDepart ? new Date(mouvement.dateDepart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
    const heureArrivee = mouvement.dateArrivee ? new Date(mouvement.dateArrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
    lines.push(`🕐 Horaires: ${heureDepart} → ${heureArrivee}`);

    // Demandeur
    if (mouvement.demandeur) {
      lines.push(`👤 Demandeur: ${mouvement.demandeur.prenom} ${mouvement.demandeur.nom}`);
    }

    // Véhicule
    if (mouvement.vehicule) {
      lines.push(`🚗 Véhicule: ${mouvement.vehicule.marque} (${mouvement.vehicule.immatriculation})`);
    }

    // Chauffeur
    if (mouvement.chauffeur) {
      lines.push(`👨‍✈️ Chauffeur: ${mouvement.chauffeur.prenom} ${mouvement.chauffeur.nom}`);
    }

    // Passagers
    if (mouvement.passagers && mouvement.passagers.length > 0) {
      const passagersList = mouvement.passagers.map((p: any) => `${p.prenom} ${p.nom}`).join(', ');
      lines.push(`👥 Passagers: ${passagersList}`);
    }

    // Projet
    if (mouvement.projet) {
      lines.push(`📁 Projet: ${mouvement.projet}`);
    }

    // Matériel
    if (mouvement.materiel && mouvement.materiel.length > 0) {
      lines.push(`📦 Matériel: ${mouvement.materiel.join(', ')}`);
    }

    // Statut
    lines.push(`📊 Statut: ${mouvement.statut}`);

    // Pour les mouvements regroupés, afficher toutes les destinations
    if (mouvement.statut === 'regroupé' && mouvement.enfantsMouvements && mouvement.enfantsMouvements.length > 0) {
      const allDestinations: string[] = [];

      // Destination du parent
      if (mouvement.stops && mouvement.stops.length > 0) {
        const parentDest = mouvement.stops[mouvement.stops.length - 1].lieu?.nom;
        if (parentDest) allDestinations.push(parentDest);
      }

      // Destinations des enfants
      mouvement.enfantsMouvements.forEach((enfant: any) => {
        if (enfant.stops && enfant.stops.length > 0) {
          const enfantDest = enfant.stops[enfant.stops.length - 1].lieu?.nom;
          if (enfantDest && !allDestinations.includes(enfantDest)) {
            allDestinations.push(enfantDest);
          }
        }
      });

      lines.push(`🎯 Toutes destinations: ${allDestinations.join(', ')}`);
    }

    return lines.join('\n');
  }

  previousWeek(): void {
    this.viewDate = addDays(this.viewDate, -7);
    this.refresh.next(true);
    this.getPlanningMouvements();
  }

  nextWeek(): void {
    this.viewDate = addDays(this.viewDate, 7);
    this.refresh.next(true);
    this.getPlanningMouvements();
  }

  today(): void {
    this.viewDate = new Date();
    this.refresh.next(true);
    this.getPlanningMouvements();
  }

  // Déterminer la couleur selon le statut du mouvement
  getColorByStatus(statut: string): { primary: string; secondary: string } {
    switch (statut) {
      case 'validé':
        return { primary: '#005fb6', secondary: '#b8dcff' }; // Bleu ACF
      case 'pris en charge':
        return { primary: '#ff9800', secondary: '#ffe0b2' }; // Orange
      case 'en cours':
        return { primary: '#9c27b0', secondary: '#e1bee7' }; // Violet
      case 'terminé':
        return { primary: '#52ae32', secondary: '#c8e6c9' }; // Vert ACF
      case 'en attente':
        return { primary: '#9e9e9e', secondary: '#e0e0e0' }; // Gris
      case 'annulé':
      case 'refusé':
        return { primary: '#f44336', secondary: '#ffcdd2' }; // Rouge
      default:
        return { primary: '#1e90ff', secondary: '#D1E8FF' }; // Bleu par défaut
    }
  }

  // Méthodes helper pour calculer le début et la fin de la semaine
  getStartOfWeek(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 }); // Semaine commence le lundi
  }

  getEndOfWeek(date: Date): Date {
    return endOfWeek(date, { weekStartsOn: 1 }); // Semaine se termine le dimanche
  }

  handleEvent(action: string, event: any): void {
    if (action === 'Clicked') {
      const mouvementId = event.meta._id;
      if (this.userProfile === 'Admin' || this.userProfile === 'Superviseur') {
        const confirmChoice = confirm(`Mouvement: ${event.title}\n\nVoulez-vous :\n- Modifier ce mouvement ? (OK)\n- Supprimer ce mouvement ? (Annuler)`);
        if (confirmChoice) {
          this.router.navigate(['/modifier-mouvement', mouvementId]);
        } else if (confirm('Voulez-vous VRAIMENT supprimer ce mouvement ?')) {
          this.mouvementService.deleteMouvement(mouvementId).subscribe(
            () => {
              alert('Mouvement supprimé avec succès !');
              this.getPlanningMouvements();
            },
            (error: any) => {
              console.error('Erreur suppression mouvement:', error);
              if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à supprimer ce mouvement.');
              else alert('Erreur lors de la suppression.');
            }
          );
        }
      } else {
        alert(`Détails du mouvement : ${event.title}`);
      }
    }
  }
}
