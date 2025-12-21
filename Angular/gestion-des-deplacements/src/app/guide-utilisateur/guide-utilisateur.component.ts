import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-guide-utilisateur',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    template: `
    <div style="padding: 20px;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Guide des Profils et Permissions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
                <th style="padding: 10px; text-align: left;">Profil</th>
                <th style="padding: 10px; text-align: left;">Périmètre</th>
                <th style="padding: 10px; text-align: left;">Gestion Utilisateurs</th>
                <th style="padding: 10px; text-align: left;">Gestion Logistique</th>
                <th style="padding: 10px; text-align: left;">Validation</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">SuperAdmin</td>
                <td style="padding: 10px;">GLOBAL (Monde)</td>
                <td style="padding: 10px;">Créer Pays, Admins, et tout autre profil. Accès à tous les pays.</td>
                <td style="padding: 10px;">Accès total</td>
                <td style="padding: 10px;">Tout valider</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">Admin</td>
                <td style="padding: 10px;">PAYS (ex: RDC)</td>
                <td style="padding: 10px;">Créer Bases (dans son pays), Superviseurs, Techniciens, Chauffeurs.</td>
                <td style="padding: 10px;">Gérer Bases, Véhicules, Lieux de son pays.</td>
                <td style="padding: 10px;">Valider mouvements de son pays.</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">Superviseur</td>
                <td style="padding: 10px;">BASE (ex: Goma)</td>
                <td style="padding: 10px;">Lecture seule</td>
                <td style="padding: 10px;">Gérer Mouvements, Véhicules de sa base.</td>
                <td style="padding: 10px;">Valider mouvements de sa base.</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">Technicien / Log Assistant</td>
                <td style="padding: 10px;">BASE</td>
                <td style="padding: 10px;">-</td>
                <td style="padding: 10px;">Créer demandes de mouvements.</td>
                <td style="padding: 10px;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">Chauffeur</td>
                <td style="padding: 10px;">BASE</td>
                <td style="padding: 10px;">-</td>
                <td style="padding: 10px;">Voir son planning, gérer e-Logbook.</td>
                <td style="padding: 10px;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">Guest</td>
                <td style="padding: 10px;">-</td>
                <td style="padding: 10px;">-</td>
                <td style="padding: 10px;">Lecture seule limitée.</td>
                <td style="padding: 10px;">-</td>
              </tr>
            </tbody>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class GuideUtilisateurComponent { }
