import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PermissionsService, ProfileMatrix, RolePermissions } from '../../core/services/permissions.service';
import { InfoBannerComponent } from '../../core/info-banner/info-banner';
import { UtilisateurService } from '../../core/services/utilisateur.service';

interface ModuleConfig {
  key: string;
  label: string;
  permissions: { key: string; label: string }[];
}

interface CategoryConfig {
  label: string;
  modules: ModuleConfig[];
}

@Component({
  selector: 'app-admin-profile-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatTabsModule, MatSnackBarModule, InfoBannerComponent],
  templateUrl: './admin-profile-matrix.html',
  styleUrls: ['./admin-profile-matrix.scss']
})
export class AdminProfileMatrixComponent implements OnInit {
  matrix: ProfileMatrix = {};
  profiles: string[] = [];
  selectedProfile: string | null = null;
  selectedCategoryIndex: number = 0;

  // Définition de la structure de la matrice pour l'affichage
  categories: CategoryConfig[] = [
    {
      label: 'Mouvements & Workflow',
      modules: [
        {
          key: 'mouvements_demandes',
          label: 'Demandes de Mouvement',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'create', label: 'Créer' },
            { key: 'edit', label: 'Modifier' },
            { key: 'delete', label: 'Supprimer' }
          ]
        },
        {
          key: 'mouvements_workflow',
          label: 'Workflow Sécurité',
          permissions: [
            { key: 'view_menu', label: 'Voir le Dashboard Workflow' },
            { key: 'manage_levels', label: 'Gérer les Niveaux' },
            { key: 'validate_level_1', label: 'Valider Sécurité (Niveau 1)' },
            { key: 'validate_level_2', label: 'Valider Sécurité (Niveau 2)' },
            { key: 'validate_level_3', label: 'Valider Sécurité (Niveau 3)' },
            { key: 'validate_level_4', label: 'Valider Sécurité (Niveau 4)' },
            { key: 'validate_level_5', label: 'Valider Sécurité (Niveau 5)' }
          ]
        },
        {
          key: 'mouvements_consolidation',
          label: 'Consolidation / Planning',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'manage', label: 'Valider Logistique (Gérer Consolidation)' }
          ]
        }
      ]
    },
    {
      label: 'e-LogBook & Mobile (Chauffeurs)',
      modules: [
        {
          key: 'mobile_chauffeur',
          label: 'Application Mobile / Trajets',
          permissions: [
            { key: 'access_app', label: 'Accès App Mobile' },
            { key: 'view_missions', label: 'Voir ses Missions' },
            { key: 'start_trip', label: 'Démarrer Trajet' },
            { key: 'end_trip', label: 'Terminer Trajet' },
            { key: 'fill_daily_log', label: 'Remplir e-LogBook (Journalier)' },
            { key: 'report_incident', label: 'Signaler un Incident' }
          ]
        }
      ]
    },
    {
      label: 'Flotte & Maintenance',
      modules: [
        {
          key: 'flotte_vehicules',
          label: 'Véhicules',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'create', label: 'Créer' },
            { key: 'edit', label: 'Modifier' },
            { key: 'delete', label: 'Supprimer' }
          ]
        },
        {
          key: 'flotte_chauffeurs',
          label: 'Profils Chauffeurs',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'create', label: 'Créer' },
            { key: 'edit', label: 'Modifier' },
            { key: 'delete', label: 'Supprimer' }
          ]
        },
        {
          key: 'flotte_maintenance',
          label: 'Gestion de la Maintenance',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'manage_alerts', label: 'Gérer les Alertes' },
            { key: 'edit_config', label: 'Modifier Configuration' }
          ]
        },
        {
          key: 'flotte_generateurs',
          label: 'Générateurs / Moteurs',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'manage', label: 'Gérer la flotte (Ajout, Modif)' }
          ]
        }
      ]
    },
    {
      label: 'Général & Paramètres',
      modules: [
        {
          key: 'admin_geo',
          label: 'Organisation Géographique',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'manage_countries', label: 'Gérer Pays' },
            { key: 'manage_bases', label: 'Gérer Bases' }
          ]
        },
        {
          key: 'admin_users',
          label: 'Utilisateurs du Système',
          permissions: [
            { key: 'view_menu', label: 'Voir (Menu)' },
            { key: 'create', label: 'Créer Utilisateur' },
            { key: 'edit', label: 'Modifier Utilisateur' }
          ]
        },
        {
          key: 'admin_settings',
          label: 'Paramètres Système',
          permissions: [
            { key: 'view_menu', label: 'Accès Menu' },
            { key: 'manage', label: 'Gérer Configuration Générale' },
            { key: 'view_helpers', label: 'Gérer Projets et Textes d\'aide' }
          ]
        },
        {
          key: 'security_matrix',
          label: 'Matrice de Sécurité',
          permissions: [
            { key: 'manage', label: 'Modifier la matrice' }
          ]
        }
      ]
    }
  ];

  constructor(private permissionsService: PermissionsService, private snackBar: MatSnackBar, private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.matrix = JSON.parse(JSON.stringify(this.permissionsService.getMatrix())); // Deep copy
    this.profiles = Object.keys(this.matrix);
  }

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    this.selectedCategoryIndex = 0;
  }

  backToList() {
    this.selectedProfile = null;
  }

  hasPerm(moduleKey: string, permKey: string): boolean {
    if (!this.selectedProfile) return false;
    const rolePerms = this.matrix[this.selectedProfile];
    if (!rolePerms || !rolePerms[moduleKey]) return false;
    return !!rolePerms[moduleKey][permKey];
  }

  togglePerm(moduleKey: string, permKey: string, event: any) {
    if (!this.selectedProfile) return;
    
    if (!this.matrix[this.selectedProfile][moduleKey]) {
      this.matrix[this.selectedProfile][moduleKey] = {};
    }
    
    this.matrix[this.selectedProfile][moduleKey][permKey] = event.checked;
  }

  createNewProfile() {
    const profileName = prompt('Entrez le nom du nouveau profil (ex: Technicien RP) :');
    if (profileName && profileName.trim()) {
      const name = profileName.trim();
      if (this.matrix[name]) {
        this.snackBar.open('Ce profil existe déjà !', 'Erreur', { duration: 3000 });
        return;
      }
      // Initialize with empty permissions
      this.matrix[name] = {};
      this.permissionsService.saveMatrix(this.matrix);
      this.profiles = Object.keys(this.matrix);
      this.snackBar.open(`Profil "${name}" créé avec succès !`, 'OK', { duration: 3000 });
      this.selectProfile(name); // Select to start editing immediately
    }
  }

  save() {
    this.permissionsService.saveMatrix(this.matrix);
    this.snackBar.open('Matrice des droits sauvegardée avec succès !', 'OK', { duration: 3000 });
    
    // Auto-update users whose security level is managed automatically
    this.utilisateurService.getUtilisateurs().subscribe({
      next: (users) => {
        const updates = users
          .filter(u => u.autoManageSecurity)
          .map(u => {
            const newLevel = this.permissionsService.getMaxSecurityLevelForProfile(u.profil);
            if (newLevel !== u.niveauValidationSecu) {
              return firstValueFrom(this.utilisateurService.updateUser(u._id, { niveauValidationSecu: newLevel }));
            }
            return null;
          })
          .filter(p => p !== null);

        if (updates.length > 0) {
          Promise.all(updates).then(() => {
            this.snackBar.open(`Mise à jour automatique de ${updates.length} utilisateur(s) affecté(s).`, 'OK', { duration: 4000 });
          }).catch(err => {
            console.error('Erreur lors de la mise à jour des utilisateurs', err);
            this.snackBar.open('Erreur lors de la mise à jour des utilisateurs.', 'Fermer', { duration: 3000 });
          });
        }
      },
      error: (err) => console.error('Erreur de chargement des utilisateurs pour maj auto:', err)
    });

    this.backToList();
  }
}
