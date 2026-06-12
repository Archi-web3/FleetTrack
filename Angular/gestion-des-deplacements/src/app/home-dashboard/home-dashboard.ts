import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsService } from '../settings.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MouvementService } from '../mouvement.service';

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

  constructor(private settingsService: SettingsService, private http: HttpClient, private mouvementService: MouvementService) {}

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
    this.userProfile = localStorage.getItem('userProfile') || '';
    this.userId = localStorage.getItem('userId') || '';
    
    // Si l'utilisateur n'a aucun profil permettant la validation, on ne charge rien
    if (!['Admin', 'Superviseur', 'Superviseur Sécurité', 'SuperAdmin'].includes(this.userProfile)) {
      this.loadingValidations = false;
      return;
    }

    this.mouvementService.getMouvements().subscribe({
      next: (mouvements) => {
        this.pendingValidations = mouvements.filter(m => {
          // Logistique
          if (['Admin', 'Superviseur', 'SuperAdmin'].includes(this.userProfile) && m.statutLogistique === 'en attente') {
            return true;
          }
          // Sécurité
          if (['Superviseur Sécurité', 'SuperAdmin'].includes(this.userProfile) && m.statutSecurite === 'en attente') {
            if (this.userProfile === 'SuperAdmin') {
              return true; // Le SuperAdmin voit toutes les demandes de sécurité en attente
            }
            if (m.securityApprovals && m.securityApprovals.length > 0) {
              return m.securityApprovals.some((a:any) => {
                const validatorId = typeof a.validator === 'string' ? a.validator : a.validator?._id;
                return validatorId === this.userId && a.status === 'pending';
              });
            }
            return true; // Legacy fallback
          }
          return false;
        });
        this.loadingValidations = false;
      },
      error: () => {
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
