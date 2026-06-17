import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityConfigService, SecurityConfig, SecurityRule } from '../security-config.service';
import { UtilisateurService } from '../utilisateur.service';
import { AuthService } from '../auth.service';
import { PermissionsService } from '../services/permissions.service';
import { AdminService } from '../admin.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { InfoBannerComponent } from '../core/info-banner/info-banner';

@Component({
    selector: 'app-security-matrix',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, MatTooltipModule, MatIconModule, InfoBannerComponent],
    templateUrl: './security-matrix.component.html',
    styleUrls: ['./security-matrix.component.css']
})
export class SecurityMatrixComponent implements OnInit {
    levels = [1, 2, 3, 4, 5];
    supervisors: any[] = [];
    config: SecurityConfig = { pays: '', rules: [] };
    isLoading = true;
    errorMessage: string | null = null;
    canManageMatrix = false;

    bases: any[] = [];
    selectedBaseId: string | null = null;

    constructor(
        private securityConfigService: SecurityConfigService,
        private utilisateurService: UtilisateurService,
        private authService: AuthService,
        public perms: PermissionsService,
        private adminService: AdminService
    ) { }

    ngOnInit(): void {
        this.canManageMatrix = this.perms.hasPermission('security_matrix', 'manage') || localStorage.getItem('userProfile') === 'SuperAdmin';
        this.loadBasesAndData();
    }

    loadBasesAndData(): void {
        const currentUser = this.authService.getUserDetails();
        const paysId = currentUser?.pays;
        
        if (paysId && paysId !== 'all') {
            this.adminService.getBases(paysId).subscribe(
                (bases) => {
                    this.bases = bases;
                    this.loadData();
                },
                (err) => {
                    console.error('Erreur chargement bases', err);
                    this.loadData(); // On charge quand même les données
                }
            );
        } else {
            this.loadData();
        }
    }

    onBaseChange(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;

        // 1. Charger les superviseurs sécurité
        // On suppose qu'il y a une méthode pour ça, sinon on filtre
        this.utilisateurService.getUtilisateurs().subscribe(users => {
            // Filtrer pour ne garder que le personnel administratif/sécurité
            // Si une base est sélectionnée, on pourrait aussi filtrer les utilisateurs de cette base ? 
            // Mais généralement la matrice utilise des validateurs qui peuvent venir d'ailleurs (ex: Admin RDC).
            // On garde tous les superviseurs du pays pour permettre la flexibilité.
            this.supervisors = users.filter((u: any) => 
                !['Chauffeur', 'Guest', 'Technicien'].includes(u.profil) && u.niveauValidationSecu >= 1
            );

            // 2. Charger la config existante
            this.securityConfigService.getConfig(this.selectedBaseId).subscribe(
                (cfg) => {
                    this.config = cfg;
                    this.initializeEmptyRules();
                    this.isLoading = false;
                    this.errorMessage = null;
                },
                (err) => {
                    console.error('Erreur chargement config', err);
                    this.isLoading = false;
                    
                    if (err.status === 400) {
                        // Utilisateur en vue globale (SuperAdmin avec 'Tous' ou aucun pays)
                        this.errorMessage = err.error?.message || "Veuillez sélectionner un pays spécifique dans le menu en haut pour configurer la matrice de sécurité.";
                        this.config = { pays: '', rules: [] };
                    } else {
                        // Si 404 ou autre, on initialise
                        this.initializeEmptyRules();
                    }
                }
            );
        });
    }

    initializeEmptyRules(): void {
        if (!this.config) {
            this.config = { pays: '', rules: [] };
        }
        // S'assurer qu'il y a une règle pour chaque niveau
        this.levels.forEach(level => {
            const existingRule = this.config.rules?.find(r => r.level === level);
            if (!existingRule) {
                if (!this.config.rules) this.config.rules = [];
                this.config.rules.push({
                    level: level,
                    mandatoryValidators: [],
                    requireUnanimity: true,
                    quorum: 1,
                    includeLowerLevels: false
                });
            }
        });
        // Trier par niveau
        this.config.rules.sort((a, b) => a.level - b.level);
    }

    isValidatorSelected(rule: SecurityRule, userId: string): boolean {
        if (!rule.mandatoryValidators) return false;
        return rule.mandatoryValidators.some((v: any) => {
            const id = typeof v === 'string' ? v : v._id;
            return id === userId;
        });
    }

    getEligibleValidators(level: number): any[] {
        // Un utilisateur ne peut valider que s'il a un niveau supérieur ou égal au niveau requis
        return this.supervisors.filter(u => u.niveauValidationSecu >= level);
    }

    toggleValidator(rule: SecurityRule, userId: string, event: any): void {
        if (!rule.mandatoryValidators) rule.mandatoryValidators = [];
        
        if (event.target.checked) {
            if (!this.isValidatorSelected(rule, userId)) {
                // On pousse l'ID sous forme de string
                rule.mandatoryValidators.push(userId as any);
            }
        } else {
            rule.mandatoryValidators = rule.mandatoryValidators.filter((v: any) => {
                const id = typeof v === 'string' ? v : v._id;
                return id !== userId;
            });
        }
    }

    save(): void {
        // Nettoyer les objets avant l'envoi, s'assurer que ce sont bien des chaînes (IDs)
        const configToSave = JSON.parse(JSON.stringify(this.config));
        configToSave.rules.forEach((rule: any) => {
            if (rule.mandatoryValidators) {
                rule.mandatoryValidators = rule.mandatoryValidators.map((v: any) => typeof v === 'string' ? v : v._id);
            }
        });

        this.securityConfigService.saveConfig(configToSave, this.selectedBaseId).subscribe(
            (res) => {
                alert('Configuration sauvegardée avec succès !');
                this.config = res; // Update with saved data
            },
            (err) => {
                console.error('Erreur sauvegarde', err);
                alert('Erreur lors de la sauvegarde.');
            }
        );
    }
}
