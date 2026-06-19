import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouvementService } from '../../core/services/mouvement.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component'; // Keep for now if needed elsewhere or safer to remove line if unused? Actually I should remove it.
import { MovementDashboardComponent } from './movement-dashboard/movement-dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

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
import { fr, es, enUS } from 'date-fns/locale';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const DATE_FNS_LOCALES: { [key: string]: any } = {
  fr: fr,
  es: es,
  en: enUS
};

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    const dateFnsLocale = DATE_FNS_LOCALES[locale!] || enUS;
    return format(date, 'EEEE d', { locale: dateFnsLocale });
  }
  public override weekViewTitle({ date, locale }: DateFormatterParams): string {
    const dateFnsLocale = DATE_FNS_LOCALES[locale!] || enUS;
    return format(date, 'MMM yyyy', { locale: dateFnsLocale });
  }
}

@Component({
  selector: 'app-planning-mouvements',
  standalone: true,
  imports: [CommonModule, CalendarModule, CalendarWeekViewComponent, MovementDashboardComponent, MatButtonModule, MatTooltipModule, MatIconModule, TranslateModule],
  templateUrl: './planning-mouvements.component.html',
  styleUrls: ['./planning-mouvements.component.scss'],
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
  currentWeekMovements: any[] = []; // Data for Dashboard
  dateRangeLabel: string = '';

  locale: string = 'fr';
  refresh: Subject<any> = new Subject();
  userProfile: string | null = null;
  currentLang: string = 'fr';

  constructor(
    private mouvementService: MouvementService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.locale = this.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.locale = event.lang;
      this.refresh.next(true); // Force calendar refresh
      this.getPlanningMouvements(); // Re-fetch or at least re-format labels
    });
  }

  // NOUVEAU: Toggle pour afficher les mouvements en attente
  showPending: boolean = false;

  ngOnInit() {
    this.userProfile = this.authService.getUserProfile();
    this.getPlanningMouvements();
  }

  togglePending(): void {
    this.showPending = !this.showPending;
    this.getPlanningMouvements();
  }

  getPlanningMouvements() {
    this.mouvementService.getPlanningMouvements(this.showPending).subscribe(
      (data: any[]) => {
        // ... (Keep existing layout logic)
        const startOfCurrentWeek = this.getStartOfWeek(this.viewDate);
        const endOfCurrentWeek = this.getEndOfWeek(this.viewDate);

        const dateFnsLocale = DATE_FNS_LOCALES[this.locale] || enUS;
        this.dateRangeLabel = `${format(startOfCurrentWeek, 'd MMM', { locale: dateFnsLocale })} - ${format(endOfCurrentWeek, 'd MMM yyyy', { locale: dateFnsLocale })}`;

        console.log('📅 Semaine affichée:', { debug: true, start: startOfCurrentWeek, end: endOfCurrentWeek, pending: this.showPending });

        // Préparer les événements pour le Dashboard - FILTRER PAR SEMAINE EN COURS
        this.currentWeekMovements = data.filter((m: any) => {
          // Robust date extraction: try root dates first, then fallback to stops
          let startStr = m.dateDepart;
          let endStr = m.dateArrivee;

          if (!startStr && m.stops && m.stops.length > 0) {
            startStr = m.stops[0].dateDepart;
          }
          if (!endStr && m.stops && m.stops.length > 0) {
            endStr = m.stops[m.stops.length - 1].dateArrivee;
          }

          if (!startStr || !endStr) {
            console.warn('⚠️ Planning: Mouvement ignoré car sans date:', m);
            return false;
          }

          const mouvementStart = new Date(startStr);
          const mouvementEnd = new Date(endStr);

          // Check for valid dates
          if (isNaN(mouvementStart.getTime()) || isNaN(mouvementEnd.getTime())) {
            return false;
          }

          const isInCurrentWeek = mouvementStart <= endOfCurrentWeek && mouvementEnd >= startOfCurrentWeek;
          return isInCurrentWeek;
        });

        this.events = data.map((mouvement: any) => {
          const title = this.getEventTitle(mouvement);
          const tooltip = this.getEventTooltip(mouvement);
          const colors = this.getColorByStatus(mouvement.statut);

          let startStr = mouvement.dateDepart;
          let endStr = mouvement.dateArrivee;

          if (!startStr && mouvement.stops && mouvement.stops.length > 0) {
            startStr = mouvement.stops[0].dateDepart;
          }
          if (!endStr && mouvement.stops && mouvement.stops.length > 0) {
            endStr = mouvement.stops[mouvement.stops.length - 1].dateArrivee;
          }

          return {
            start: startStr ? new Date(startStr) : new Date(),
            end: endStr ? new Date(endStr) : new Date(),
            title: title,
            color: colors,
            allDay: false,
            resizable: { beforeStart: true, afterEnd: true },
            draggable: true,
            meta: { ...mouvement, tooltip: tooltip, hasConflict: false }
          };
        });

        // ... (Keep existing conflict logic)
        for (let i = 0; i < this.events.length; i++) {
          for (let j = i + 1; j < this.events.length; j++) {
            const e1 = this.events[i];
            const e2 = this.events[j];
            if (e1.start < e2.end && e1.end > e2.start &&
              e1.meta.statut !== 'annulé' && e1.meta.statut !== 'refusé' &&
              e2.meta.statut !== 'annulé' && e2.meta.statut !== 'refusé'
            ) {
              const ch1 = e1.meta.chauffeur?._id;
              const ch2 = e2.meta.chauffeur?._id;
              const v1 = e1.meta.vehicule?._id;
              const v2 = e2.meta.vehicule?._id;

              let conflictFound = false;
              if (ch1 && ch2 && ch1 === ch2) conflictFound = true;
              if (v1 && v2 && v1 === v2) conflictFound = true;

              if (conflictFound) {
                e1.meta.hasConflict = true;
                e2.meta.hasConflict = true;
                e1.meta.tooltip = '⚠️ CONFLIT DÉTECTÉ \n' + e1.meta.tooltip;
                e2.meta.tooltip = '⚠️ CONFLIT DÉTECTÉ \n' + e2.meta.tooltip;
              }
            }
          }
        }

        this.refresh.next(true);
      },
      (error: any) => {
        console.error('Erreur chargement planning des mouvements:', error);
      }
    );
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

  // NOUVEAU: Générer un titre simplifié pour l'événement
  getEventTitle(mouvement: any): string {
    // Si c'est une maintenance, afficher le type (et description courte)
    if (mouvement.type === 'maintenance') {
      const vehiculeInfo = mouvement.vehicule ? ` - ${mouvement.vehicule.acfCode || mouvement.vehicule.immatriculation}` : '';
      return `🔧 ${mouvement.maintenanceType}${vehiculeInfo}`;
    }

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
    lines.push(`📍 ${this.translate.instant('VALIDATION.OBJECTIVE')}: ${mouvement.objectif || 'Non spécifié'}`);

    // Horaires
    // Simplified locale string usage for time
    const localeForTime = this.locale === 'en' ? 'en-US' : (this.locale === 'es' ? 'es-ES' : 'fr-FR');
    const heureDepart = mouvement.dateDepart ? new Date(mouvement.dateDepart).toLocaleTimeString(localeForTime, { hour: '2-digit', minute: '2-digit' }) : 'N/A';
    const heureArrivee = mouvement.dateArrivee ? new Date(mouvement.dateArrivee).toLocaleTimeString(localeForTime, { hour: '2-digit', minute: '2-digit' }) : 'N/A';
    lines.push(`🕐 ${this.translate.instant('NEW_REQUEST.MISSION.DEPARTURE_TIME')}/${this.translate.instant('NEW_REQUEST.MISSION.ARRIVAL_TIME')}: ${heureDepart} → ${heureArrivee}`);

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
    const statusKey = this.getStatusKey(mouvement.statut);
    lines.push(`📊 ${this.translate.instant('MY_TRIPS.STATUS')}: ${this.translate.instant(statusKey)}`);

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

  getStatusKey(status: string): string {
    if (!status) return '';
    const s = status.toLowerCase();
    switch (s) {
      case 'validé': return 'PLANNING.STATUS.VALIDATED';
      case 'en attente': return 'PLANNING.STATUS.PENDING';
      case 'en attente validation sécurité': return 'En Attente Sécurité'; // TEMPORAIRE ou Key
      case 'terminé': return 'PLANNING.STATUS.COMPLETED';
      case 'annulé': return 'PLANNING.STATUS.CANCELLED';
      case 'refusé': return 'PLANNING.STATUS.CANCELLED';
      case 'en cours': return 'PLANNING.STATUS.IN_PROGRESS';
      case 'pris en charge': return 'PLANNING.STATUS.TAKEN';
      default: return status;
    }
  }

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
      case 'en attente validation sécurité':
        return { primary: '#a31545', secondary: '#ffcdd2' }; // Rouge Foncé / Rose alerte (Distinct de refusé)
      case 'annulé':
      case 'refusé':
        return { primary: '#f44336', secondary: '#ffcdd2' }; // Rouge clair
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
