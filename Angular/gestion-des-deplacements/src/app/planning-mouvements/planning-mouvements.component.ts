import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouvementService } from '../mouvement.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [CommonModule, CalendarModule, CalendarWeekViewComponent, MapMouvementsComponent, MatButtonModule],
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
          // Construire le titre avec les infos de véhicule et chauffeur
          let title = `${mouvement.objectif} (${mouvement.demandeur?.nom})`;
          if (mouvement.vehicule) {
            title += ` - Voiture: ${mouvement.vehicule.marque} (${mouvement.vehicule.immatriculation})`;
          }
          if (mouvement.chauffeur) {
            title += ` - Chauffeur: ${mouvement.chauffeur.prenom} ${mouvement.chauffeur.nom}`;
          }

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
            meta: mouvement
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
