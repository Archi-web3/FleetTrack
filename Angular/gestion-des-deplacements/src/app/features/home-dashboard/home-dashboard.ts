import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsService } from '../../core/services/settings.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MouvementService } from '../../core/services/mouvement.service';
import { AuthService } from '../../core/services/auth.service';
import { PermissionsService } from '../../core/services/permissions.service';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home-dashboard.html',
  styleUrls: ['./home-dashboard.css']
})
export class HomeDashboardComponent implements OnInit {
  newsBanner: string | null = null;
  userName: string = '';
  brandSettings: any = {};
  
  weather: { temp: number, description: string, icon: string, location: string } | null = null;
  weatherLoading = true;
  weatherError = false;

  pendingValidations: any[] = [];
  loadingValidations = true;
  userId: string = '';
  userProfile: string = '';

  constructor(
    private settingsService: SettingsService, 
    private http: HttpClient, 
    private mouvementService: MouvementService,
    private authService: AuthService,
    private perms: PermissionsService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'Utilisateur';
    this.settingsService.getBrandSettings().subscribe(settings => {
      this.brandSettings = settings || {};
      if (settings && settings.newsBanner) {
        this.newsBanner = settings.newsBanner;
      }
    });
    
    this.initWeather();
    this.fetchPendingValidations();
  }

  fetchPendingValidations() {
    this.userProfile = this.authService.getUserProfile() || '';
    this.userId = this.authService.getUserId() || '';
    
    // Vérification des droits via la matrice RBAC (PermissionsService)
    const canValidateLogistics = this.perms.hasPermission('mouvements_consolidation', 'manage');
    const canValidateSecurity = this.perms.hasPermission('mouvements_workflow', 'validate_level_1') || 
                                this.perms.hasPermission('mouvements_workflow', 'validate_level_2') || 
                                this.perms.hasPermission('mouvements_workflow', 'validate_level_3') || 
                                this.perms.hasPermission('mouvements_workflow', 'validate_level_4') || 
                                this.perms.hasPermission('mouvements_workflow', 'validate_level_5');

    // Si l'utilisateur n'a aucun profil permettant la validation, on ne charge rien
    if (!canValidateLogistics && !canValidateSecurity && this.userProfile !== 'SuperAdmin') {
      this.loadingValidations = false;
      return;
    }

    this.mouvementService.getMouvements().subscribe({
      next: (mouvements) => {
        console.log(`[HomeDashboard] Total mouvements reçus : ${mouvements.length}`);
        this.pendingValidations = mouvements.filter(m => {
          // On ignore d'office les mouvements terminés, annulés, refusés, regroupés ou de maintenance
          const inactiveStatuses = ['terminé', 'annulé', 'refusé', 'regroupé'];
          if (inactiveStatuses.includes(m.statut) || m.type === 'maintenance') {
            return false;
          }

          const isLogAttente = m.statutLogistique === 'en attente' || (!m.statutLogistique && m.statut === 'en attente');
          const isSecuAttente = m.statutSecurite === 'en attente' || (!m.statutSecurite && m.statut === 'en attente validation sécurité') || (!m.statutSecurite && m.statut === 'en attente' && m.validationLevelRequired > 1);

          let keep = false;
          let displayTypes: string[] = [];

          // Logistique
          if ((canValidateLogistics || this.userProfile === 'SuperAdmin') && isLogAttente) {
            console.log(`[HomeDashboard] Gardé (Logistique): ${m._id} - statut: ${m.statut}`);
            displayTypes.push('Logistique');
            keep = true;
          }
          
          // Sécurité
          if ((canValidateSecurity || this.userProfile === 'SuperAdmin') && isSecuAttente) {
            if (this.userProfile === 'SuperAdmin') {
              console.log(`[HomeDashboard] Gardé (Sécurité SuperAdmin): ${m._id} - statut: ${m.statut}`);
              displayTypes.push('Sécurité');
              keep = true; // Le SuperAdmin voit toutes les demandes de sécurité en attente
            } else if (m.securityApprovals && m.securityApprovals.length > 0) {
              const hasPending = m.securityApprovals.some((a:any) => {
                const validatorId = typeof a.validator === 'string' ? a.validator : a.validator?._id;
                return validatorId === this.userId && a.status === 'pending';
              });
              if (hasPending) {
                console.log(`[HomeDashboard] Gardé (Sécurité Validator): ${m._id} - statut: ${m.statut}`);
                displayTypes.push('Sécurité');
                keep = true;
              }
            } else {
              console.log(`[HomeDashboard] Gardé (Sécurité Legacy Fallback): ${m._id} - statut: ${m.statut}`);
              displayTypes.push('Sécurité');
              keep = true; // Legacy fallback pour les anciens mouvements
            }
          }
          
          m.validationTypes = displayTypes;
          return keep;
        });
        console.log(`[HomeDashboard] Mouvements en attente conservés : ${this.pendingValidations.length}`);
        this.loadingValidations = false;
      },
      error: (err) => {
        console.error(`[HomeDashboard] Erreur chargement mouvements :`, err);
        this.loadingValidations = false;
      }
    });
  }

  initWeather() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.fetchWeather(position.coords.latitude, position.coords.longitude, 'Position actuelle');
        },
        (error) => {
          console.warn('Geolocation refusée ou erreur, utilisation de Paris par défaut', error);
          this.fetchWeather(48.8566, 2.3522, 'Paris, France (Défaut)');
        }
      );
    } else {
      this.fetchWeather(48.8566, 2.3522, 'Paris, France (Défaut)');
    }
  }

  fetchWeather(lat: number, lon: number, locationName: string) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    
    this.http.get<any>(url).pipe(
      catchError(err => {
        this.weatherError = true;
        this.weatherLoading = false;
        return of(null);
      })
    ).subscribe(data => {
      if (data && data.current_weather) {
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        
        let desc = 'Clair';
        let icon = 'wb_sunny';
        
        if (code === 0) { desc = 'Ciel dégagé'; icon = 'wb_sunny'; }
        else if (code === 1 || code === 2 || code === 3) { desc = 'Partiellement nuageux'; icon = 'cloud_queue'; }
        else if (code === 45 || code === 48) { desc = 'Brouillard'; icon = 'foggy'; }
        else if (code >= 51 && code <= 55) { desc = 'Bruine'; icon = 'grain'; }
        else if (code >= 61 && code <= 65) { desc = 'Pluie'; icon = 'water_drop'; }
        else if (code >= 71 && code <= 77) { desc = 'Neige'; icon = 'ac_unit'; }
        else if (code >= 80 && code <= 82) { desc = 'Averses'; icon = 'water_drop'; }
        else if (code >= 95) { desc = 'Orage'; icon = 'thunderstorm'; }

        this.weather = {
          temp,
          description: desc,
          icon,
          location: locationName
        };
        this.weatherLoading = false;
      }
    });
  }
}
