import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityConfigService, SecurityConfig, SecurityRule } from '../security-config.service';
import { UtilisateurService } from '../utilisateur.service';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-security-matrix',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, MatTooltipModule, MatIconModule],
    templateUrl: './security-matrix.component.html',
    styleUrls: ['./security-matrix.component.css']
})
export class SecurityMatrixComponent implements OnInit {
    levels = [1, 2, 3, 4, 5];
    supervisors: any[] = [];
    config: SecurityConfig = { pays: '', rules: [] };
    isLoading = true;

    constructor(
        private securityConfigService: SecurityConfigService,
        private utilisateurService: UtilisateurService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;

        // 1. Charger les superviseurs sécurité
        // On suppose qu'il y a une méthode pour ça, sinon on filtre
        this.utilisateurService.getUtilisateurs().subscribe(users => {
            // Filtrer pour ne garder que les Superviseurs Sécurité du même pays (idéalement)
            // Pour l'instant on prend tous les Superviseurs Sécurité
            this.supervisors = users.filter((u: any) => u.profil === 'Superviseur Sécurité');

            // 2. Charger la config existante
            this.securityConfigService.getConfig().subscribe(
                (cfg) => {
                    this.config = cfg;
                    this.initializeEmptyRules();
                    this.isLoading = false;
                },
                (err) => {
                    console.error('Erreur chargement config', err);
                    // Si 404 ou vide, on initialise
                    this.initializeEmptyRules();
                    this.isLoading = false;
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
                    quorum: 1
                });
            }
        });
        // Trier par niveau
        this.config.rules.sort((a, b) => a.level - b.level);
    }

    isValidatorSelected(rule: SecurityRule, userId: string): boolean {
        return rule.mandatoryValidators.includes(userId);
    }

    toggleValidator(rule: SecurityRule, userId: string, event: any): void {
        if (event.target.checked) {
            if (!rule.mandatoryValidators.includes(userId)) {
                rule.mandatoryValidators.push(userId);
            }
        } else {
            rule.mandatoryValidators = rule.mandatoryValidators.filter(id => id !== userId);
        }
    }

    save(): void {
        this.securityConfigService.saveConfig(this.config).subscribe(
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
