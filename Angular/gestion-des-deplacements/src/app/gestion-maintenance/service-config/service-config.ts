import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MaintenanceService, MaintenanceConfig } from '../../maintenance.service';

@Component({
    selector: 'app-service-config',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        MatTableModule
    ],
    templateUrl: './service-config.html',
    styleUrls: ['./service-config.scss']
})
export class ServiceConfigComponent implements OnInit {
    configs: MaintenanceConfig[] = [];
    configForm: FormGroup;
    selectedConfig: MaintenanceConfig | null = null;
    displayedColumns: string[] = ['typeVehicule', 'conditions', 'intervalle', 'actions'];

    constructor(
        private maintenanceService: MaintenanceService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.configForm = this.fb.group({
            typeVehicule: ['', Validators.required],
            conditionsRoute: ['Normale', Validators.required], // Normale, Difficile, Extrême
            intervalleService: [5000, [Validators.required, Validators.min(1000)]],
            intervalleVidangeBonne: [5000, Validators.required],
            intervalleVidangeMauvaise: [2500, Validators.required],
            qualiteCarburant: ['Bonne', Validators.required],
            actif: [true]
        });
    }

    ngOnInit() {
        this.loadConfigs();
    }

    loadConfigs() {
        this.maintenanceService.getConfigs().subscribe({
            next: (data) => this.configs = data,
            error: (err) => console.error('Erreur chargement configs:', err)
        });
    }

    selectConfig(config: MaintenanceConfig) {
        this.selectedConfig = config;
        this.configForm.patchValue({
            typeVehicule: config.typeVehicule,
            conditionsRoute: config.conditionsRoute,
            intervalleService: config.intervalleService,
            intervalleVidangeBonne: config.intervalleVidange.bonneQualite,
            intervalleVidangeMauvaise: config.intervalleVidange.mauvaiseQualite,
            qualiteCarburant: config.qualiteCarburant,
            actif: config.actif
        });
    }

    resetForm() {
        this.selectedConfig = null;
        this.configForm.reset({
            typeVehicule: '',
            conditionsRoute: 'Normale',
            intervalleService: 5000,
            intervalleVidangeBonne: 5000,
            intervalleVidangeMauvaise: 2500,
            qualiteCarburant: 'Bonne',
            actif: true
        });
    }

    saveConfig() {
        if (this.configForm.invalid) return;

        const formValue = this.configForm.value;
        const configData: Partial<MaintenanceConfig> = {
            typeVehicule: formValue.typeVehicule,
            conditionsRoute: formValue.conditionsRoute,
            intervalleService: formValue.intervalleService,
            intervalleVidange: {
                bonneQualite: formValue.intervalleVidangeBonne,
                mauvaiseQualite: formValue.intervalleVidangeMauvaise
            },
            qualiteCarburant: formValue.qualiteCarburant,
            actif: formValue.actif
        };

        if (this.selectedConfig) {
            this.maintenanceService.updateConfig(this.selectedConfig._id, configData).subscribe({
                next: () => {
                    this.snackBar.open('Configuration mise à jour', 'OK', { duration: 3000 });
                    this.loadConfigs();
                    this.resetForm();
                },
                error: (err) => console.error('Erreur MAJ config:', err)
            });
        } else {
            this.maintenanceService.createConfig(configData).subscribe({
                next: () => {
                    this.snackBar.open('Configuration créée', 'OK', { duration: 3000 });
                    this.loadConfigs();
                    this.resetForm();
                },
                error: (err) => console.error('Erreur création config:', err)
            });
        }
    }

    deleteConfig(config: MaintenanceConfig) {
        if (confirm(`Supprimer la configuration pour ${config.typeVehicule} ?`)) {
            this.maintenanceService.deleteConfig(config._id).subscribe({
                next: () => {
                    this.snackBar.open('Configuration supprimée', 'OK', { duration: 3000 });
                    this.loadConfigs();
                    if (this.selectedConfig?._id === config._id) this.resetForm();
                },
                error: (err) => console.error('Erreur suppression:', err)
            });
        }
    }
}
