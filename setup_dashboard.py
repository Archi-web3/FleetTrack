import re

# 1. Update app.routes.ts
routes_path = "Angular/gestion-des-deplacements/src/app/app.routes.ts"
with open(routes_path, "r") as f:
    routes_code = f.read()

if "HomeDashboardComponent" not in routes_code:
    routes_code = routes_code.replace(
        "import { MapComponent } from './features/map/map';",
        "import { MapComponent } from './features/map/map';\nimport { HomeDashboardComponent } from './home-dashboard/home-dashboard';"
    )
    
    old_redirect = """{
    path: '',
    redirectTo: 'planning',
    pathMatch: 'full'
  },"""
    new_home = """{
    path: '',
    component: HomeDashboardComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },"""
    
    routes_code = routes_code.replace(old_redirect, new_home)
    with open(routes_path, "w") as f:
        f.write(routes_code)

# 2. Update home-dashboard.ts
ts_path = "Angular/gestion-des-deplacements/src/app/home-dashboard/home-dashboard.ts"
with open(ts_path, "r") as f:
    ts_code = f.read()

new_ts = """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home-dashboard.html',
  styleUrls: ['./home-dashboard.css']
})
export class HomeDashboardComponent implements OnInit {
  newsBanner: string | null = null;
  userName: string = '';

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'Utilisateur';
    this.settingsService.getBrandSettings().subscribe(settings => {
      if (settings && settings.newsBanner) {
        this.newsBanner = settings.newsBanner;
      }
    });
  }
}
"""
with open(ts_path, "w") as f:
    f.write(new_ts)

# 3. Update home-dashboard.html
html_path = "Angular/gestion-des-deplacements/src/app/home-dashboard/home-dashboard.html"
new_html = """<div class="home-container">
  
  <!-- News Banner -->
  <div class="news-banner" *ngIf="newsBanner">
    <mat-icon>campaign</mat-icon>
    <span>{{ newsBanner }}</span>
  </div>

  <div class="welcome-header">
    <h1>Bonjour, {{ userName }} ! 👋</h1>
    <p>Bienvenue sur votre espace FleetTrack.</p>
  </div>

  <div class="dashboard-grid">
    <!-- Quick Actions -->
    <mat-card class="widget-card actions-widget">
      <mat-card-header>
        <mat-card-title>Actions Rapides</mat-card-title>
      </mat-card-header>
      <mat-card-content class="actions-grid">
        <button mat-flat-button color="primary" routerLink="/demande-mouvement">
          <mat-icon>add_circle</mat-icon> Nouveau Mouvement
        </button>
        <button mat-stroked-button color="primary" routerLink="/planning">
          <mat-icon>calendar_month</mat-icon> Mon Planning
        </button>
        <button mat-stroked-button color="primary" routerLink="/map">
          <mat-icon>map</mat-icon> Carte Interactive
        </button>
      </mat-card-content>
    </mat-card>

    <!-- Weather Widget Placeholder -->
    <mat-card class="widget-card weather-widget">
      <mat-card-content class="weather-content">
        <div class="weather-info">
          <h2>Paris, France</h2>
          <div class="temp">22°C</div>
          <p>Ensoleillé avec quelques nuages</p>
        </div>
        <div class="weather-icon">
          <mat-icon>wb_sunny</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
"""
with open(html_path, "w") as f:
    f.write(new_html)

# 4. Update home-dashboard.css
css_path = "Angular/gestion-des-deplacements/src/app/home-dashboard/home-dashboard.css"
new_css = """
.home-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.news-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff3cd;
  color: #856404;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 4px solid #ffc107;
}

.welcome-header {
  margin-bottom: 32px;
}

.welcome-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-main, #1e293b);
  margin: 0 0 8px 0;
}

.welcome-header p {
  color: var(--text-muted, #64748b);
  font-size: 16px;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.widget-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.actions-grid button {
  justify-content: flex-start;
  padding: 8px 16px;
  border-radius: 8px;
}

/* Weather Widget styling */
.weather-widget {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.weather-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 10px;
}

.weather-info h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 500;
}

.weather-info .temp {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 5px;
}

.weather-info p {
  margin: 0;
  opacity: 0.9;
}

.weather-icon mat-icon {
  font-size: 80px;
  width: 80px;
  height: 80px;
  opacity: 0.9;
}
"""
with open(css_path, "w") as f:
    f.write(new_css)

# 5. Add newsBanner setting input to GeneralSettings
gs_html = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.html"
with open(gs_html, "r") as f:
    gs_code = f.read()

news_input = """
            <div class="modern-form-group" style="grid-column: 1 / -1;">
              <label>Bandeau d'actualités (Accueil)</label>
              <textarea class="modern-input" [(ngModel)]="brandSettings.newsBanner" placeholder="Message important pour tous les utilisateurs..."></textarea>
            </div>
"""

if "newsBanner" not in gs_code:
    gs_code = gs_code.replace(
        '<div class="modern-form-group">\n              <label>Texte du pied de page',
        news_input + '\n            <div class="modern-form-group">\n              <label>Texte du pied de page'
    )
    with open(gs_html, "w") as f:
        f.write(gs_code)

print("Home dashboard component implemented and set as default route.")
