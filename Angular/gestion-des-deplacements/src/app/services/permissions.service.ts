import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

export interface RolePermissions {
  [module: string]: {
    [action: string]: boolean;
  };
}

export interface ProfileMatrix {
  [profileName: string]: RolePermissions;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly STORAGE_KEY = 'acf_permissions_matrix';

  // Matrice par défaut si rien n'est sauvegardé en BDD/LocalStorage
  private defaultMatrix: ProfileMatrix = {
    'SuperAdmin': {
      'mouvements_demandes': { view_menu: true, create: true, edit: true, delete: true },
      'mouvements_workflow': { view_menu: true, manage_levels: true, validate_level_1: true, validate_level_2: true, validate_level_3: true, validate_level_4: true, validate_level_5: true },
      'mouvements_consolidation': { view_menu: true, manage: true },
      'mobile_chauffeur': { access_app: true, view_missions: true, start_trip: true, end_trip: true, fill_daily_log: true, report_incident: true },
      'flotte_vehicules': { view_menu: true, create: true, edit: true, delete: true },
      'flotte_chauffeurs': { view_menu: true, create: true, edit: true, delete: true },
      'flotte_maintenance': { view_menu: true, manage_alerts: true, edit_config: true },
      'admin_geo': { view_menu: true, manage_countries: true, manage_bases: true },
      'admin_users': { view_menu: true, create: true, edit: true },
      'admin_settings': { view_menu: true, manage: true, view_helpers: true }
    },
    'Admin': {
      'mouvements_demandes': { view_menu: true, create: true, edit: true, delete: true },
      'mouvements_workflow': { view_menu: true, manage_levels: true, validate_level_1: true, validate_level_2: true, validate_level_3: true, validate_level_4: true, validate_level_5: true },
      'mouvements_consolidation': { view_menu: true, manage: true },
      'mobile_chauffeur': { access_app: true, view_missions: true, start_trip: true, end_trip: true, fill_daily_log: true, report_incident: true },
      'flotte_vehicules': { view_menu: true, create: true, edit: true, delete: true },
      'flotte_chauffeurs': { view_menu: true, create: true, edit: true, delete: true },
      'flotte_maintenance': { view_menu: true, manage_alerts: true, edit_config: true },
      'admin_geo': { view_menu: true, manage_countries: true, manage_bases: true },
      'admin_users': { view_menu: true, create: true, edit: true },
      'admin_settings': { view_menu: true, manage: true, view_helpers: false }
    },
    'Superviseur': {
      'mouvements_demandes': { view_menu: true, create: true, edit: true, delete: false },
      'mouvements_workflow': { view_menu: true, manage_levels: false, validate_level_1: true, validate_level_2: true, validate_level_3: true, validate_level_4: true, validate_level_5: false },
      'mouvements_consolidation': { view_menu: true, manage: true },
      'mobile_chauffeur': { access_app: false, view_missions: false, start_trip: false, end_trip: false, fill_daily_log: false, report_incident: false },
      'flotte_vehicules': { view_menu: true, create: false, edit: false, delete: false },
      'flotte_chauffeurs': { view_menu: true, create: false, edit: false, delete: false },
      'flotte_maintenance': { view_menu: true, manage_alerts: true, edit_config: false },
      'admin_geo': { view_menu: false, manage_countries: false, manage_bases: false },
      'admin_users': { view_menu: false, create: false, edit: false },
      'admin_settings': { view_menu: false, manage: false, view_helpers: false }
    },
    'Superviseur Sécurité': {
      'mouvements_demandes': { view_menu: true, create: false, edit: false, delete: false },
      'mouvements_workflow': { view_menu: true, manage_levels: true, validate_level_1: false, validate_level_2: false, validate_level_3: false, validate_level_4: true, validate_level_5: true },
      'mouvements_consolidation': { view_menu: false, manage: false },
      'mobile_chauffeur': { access_app: false },
      'flotte_vehicules': { view_menu: false },
      'flotte_chauffeurs': { view_menu: false },
      'flotte_maintenance': { view_menu: false },
      'admin_geo': { view_menu: false },
      'admin_users': { view_menu: false },
      'admin_settings': { view_menu: false, view_helpers: false }
    },
    'Logisticien': {
      'mouvements_demandes': { view_menu: true, create: true, edit: true, delete: false },
      'mouvements_workflow': { view_menu: true, manage_levels: false, validate_level_1: true, validate_level_2: true, validate_level_3: true, validate_level_4: false, validate_level_5: false },
      'mouvements_consolidation': { view_menu: true, manage: true },
      'mobile_chauffeur': { access_app: false },
      'flotte_vehicules': { view_menu: true, create: true, edit: true, delete: false },
      'flotte_chauffeurs': { view_menu: true, create: true, edit: true, delete: false },
      'flotte_maintenance': { view_menu: true, manage_alerts: true, edit_config: false },
      'admin_geo': { view_menu: false },
      'admin_users': { view_menu: false },
      'admin_settings': { view_menu: false, view_helpers: false }
    },
    'Chauffeur': {
      'mouvements_demandes': { view_menu: false, create: false, edit: false, delete: false },
      'mouvements_workflow': { view_menu: false, manage_levels: false, validate_level_1: false, validate_level_2: false, validate_level_3: false, validate_level_4: false, validate_level_5: false },
      'mouvements_consolidation': { view_menu: false, manage: false },
      'mobile_chauffeur': { access_app: true, view_missions: true, start_trip: true, end_trip: true, fill_daily_log: true, report_incident: true },
      'flotte_vehicules': { view_menu: false, create: false, edit: false, delete: false },
      'flotte_chauffeurs': { view_menu: false, create: false, edit: false, delete: false },
      'flotte_maintenance': { view_menu: false, manage_alerts: false, edit_config: false },
      'admin_geo': { view_menu: false, manage_countries: false, manage_bases: false },
      'admin_users': { view_menu: false, create: false, edit: false },
      'admin_settings': { view_menu: false, manage: false, view_helpers: false }
    },
    'Guest': {
      'mouvements_demandes': { view_menu: true, create: true, edit: false, delete: false },
      'mouvements_workflow': { view_menu: false, manage_levels: false, validate_level_1: false, validate_level_2: false, validate_level_3: false, validate_level_4: false, validate_level_5: false },
      'mouvements_consolidation': { view_menu: false, manage: false },
      'mobile_chauffeur': { access_app: false, view_missions: false, start_trip: false, end_trip: false, fill_daily_log: false, report_incident: false },
      'flotte_vehicules': { view_menu: false, create: false, edit: false, delete: false },
      'flotte_chauffeurs': { view_menu: false, create: false, edit: false, delete: false },
      'flotte_maintenance': { view_menu: false, manage_alerts: false, edit_config: false },
      'admin_geo': { view_menu: false, manage_countries: false, manage_bases: false },
      'admin_users': { view_menu: false, create: false, edit: false },
      'admin_settings': { view_menu: false, manage: false, view_helpers: false }
    },
    'Technicien': {
      'mouvements_demandes': { view_menu: true, create: true, edit: true, delete: false },
      'mouvements_workflow': { view_menu: false, manage_levels: false, validate_level_1: false, validate_level_2: false, validate_level_3: false, validate_level_4: false, validate_level_5: false },
      'mouvements_consolidation': { view_menu: false, manage: false },
      'mobile_chauffeur': { access_app: true, view_missions: true, start_trip: true, end_trip: true, fill_daily_log: true, report_incident: true },
      'flotte_vehicules': { view_menu: true, create: false, edit: false, delete: false },
      'flotte_chauffeurs': { view_menu: true, create: false, edit: false, delete: false },
      'flotte_maintenance': { view_menu: false, manage_alerts: false, edit_config: false },
      'admin_geo': { view_menu: false, manage_countries: false, manage_bases: false },
      'admin_users': { view_menu: false, create: false, edit: false },
      'admin_settings': { view_menu: false, manage: false, view_helpers: false }
    }
  };

  private permissionsSubject = new BehaviorSubject<ProfileMatrix>(this.loadMatrix());
  permissions$ = this.permissionsSubject.asObservable();

  constructor(private authService: AuthService) {}

  private loadMatrix(): ProfileMatrix {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let hasChanges = false;
        // Fusionner les profils et permissions par défaut manquants
        for (const profile of Object.keys(this.defaultMatrix)) {
          if (!parsed[profile]) {
            parsed[profile] = JSON.parse(JSON.stringify(this.defaultMatrix[profile]));
            hasChanges = true;
          } else {
            for (const module of Object.keys(this.defaultMatrix[profile])) {
              if (!parsed[profile][module]) {
                parsed[profile][module] = JSON.parse(JSON.stringify(this.defaultMatrix[profile][module]));
                hasChanges = true;
              } else {
                for (const perm of Object.keys(this.defaultMatrix[profile][module])) {
                  if (parsed[profile][module][perm] === undefined) {
                    parsed[profile][module][perm] = this.defaultMatrix[profile][module][perm];
                    hasChanges = true;
                  }
                }
              }
            }
          }
        }
        if (hasChanges) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error('Erreur parsing permissions matrix', e);
      }
    }
    return this.defaultMatrix;
  }

  saveMatrix(matrix: ProfileMatrix) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matrix));
    this.permissionsSubject.next(this.loadMatrix());
  }

  getMaxSecurityLevelForProfile(profileName: string): number {
    const matrix = this.getMatrix();
    const profilePerms = matrix[profileName];
    if (!profilePerms || !profilePerms['mouvements_workflow']) return 1;

    const wf = profilePerms['mouvements_workflow'];
    if (wf['validate_level_5']) return 5;
    if (wf['validate_level_4']) return 4;
    if (wf['validate_level_3']) return 3;
    if (wf['validate_level_2']) return 2;
    if (wf['validate_level_1']) return 1;
    return 1;
  }

  getMatrix(): ProfileMatrix {
    return this.permissionsSubject.getValue();
  }

  /**
   * Vérifie si l'utilisateur actuel possède la permission demandée.
   */
  hasPermission(module: string, action: string): boolean {
    const userProfile = this.authService.getUserProfile();
    if (!userProfile) return false;
    
    const matrix = this.getMatrix();
    const rolePerms = matrix[userProfile];
    
    if (!rolePerms || !rolePerms[module]) {
      // Sécurité par défaut : le SuperAdmin a toujours tous les droits si ce n'est pas défini
      if (userProfile === 'SuperAdmin') return true;
      return false; // Par défaut fermé
    }

    return !!rolePerms[module][action];
  }

  /**
   * Vérifie spécifiquement le droit d'afficher un menu
   */
  canViewMenu(menuKey: string): boolean {
    return this.hasPermission(menuKey, 'view_menu');
  }
}
