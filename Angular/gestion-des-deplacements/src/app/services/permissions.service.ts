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
      'admin_settings': { view_menu: true, manage: true }
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
      'admin_settings': { view_menu: true, manage: true }
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
      'admin_settings': { view_menu: false, manage: false }
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
      'admin_settings': { view_menu: false }
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
      'admin_settings': { view_menu: false }
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
      'admin_settings': { view_menu: false, manage: false }
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
      'admin_settings': { view_menu: false, manage: false }
    }
  };

  private permissionsSubject = new BehaviorSubject<ProfileMatrix>(this.loadMatrix());
  permissions$ = this.permissionsSubject.asObservable();

  constructor(private authService: AuthService) {}

  private loadMatrix(): ProfileMatrix {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur parsing permissions matrix', e);
      }
    }
    return this.defaultMatrix;
  }

  saveMatrix(matrix: ProfileMatrix) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matrix));
    this.permissionsSubject.next(matrix);
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
