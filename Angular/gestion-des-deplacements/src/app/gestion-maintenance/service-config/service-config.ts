import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaintenanceService, MaintenanceConfig } from '../../maintenance.service';
import { SettingsService } from '../../settings.service';
import { TranslateModule } from '@ngx-translate/core';

/* const VEHICLE_TYPES removed */
/* const VEHICLE_TYPES removed */

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
        MatSnackBarModule,
        MatSnackBarModule,
        MatTableModule,
        MatDialogModule,
        TranslateModule
    ],
    templateUrl: './service-config.html',
    styleUrls: ['./service-config.scss']
})
export class ServiceConfigComponent implements OnInit {
    configs: MaintenanceConfig[] = [];
    configForm: FormGroup;
    selectedConfig: MaintenanceConfig | null = null;
    displayedColumns: string[] = ['typeVehicule', 'conditions', 'intervalle', 'actions'];
    vehicleTypes: string[] = [];
    @ViewChild('configFormDialog') configFormDialog!: TemplateRef<any>;

    constructor(
        private maintenanceService: MaintenanceService,
        private settingsService: SettingsService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.configForm = this.fb.group({
            typeVehicule: ['', Validators.required],
            conditionsRoute: ['Route mixte/urbaine', Validators.required],
            intervalleService: [5000, [Validators.required, Validators.min(1000)]],
            sequenceMode: ['Predefined', Validators.required],
            customSequence: [['A', 'B', 'A', 'C']],
            // Vidange fields removed
            qualiteCarburant: ['Bonne', Validators.required],
            actif: [true]
        });
    }

    // Gestion de la séquence
    get customSequenceControls() {
        return this.configForm.get('customSequence')?.value || [];
    }

    addSequenceStep(step: string) {
        if (!step) return;
        const current = [...this.customSequenceControls];
        current.push(step);
        this.configForm.patchValue({ customSequence: current });
    }

    removeSequenceStep(index: number) {
        const current = [...this.customSequenceControls];
        current.splice(index, 1);
        this.configForm.patchValue({ customSequence: current });
    }

    ngOnInit() {
        this.loadConfigs();
        this.loadVehicleTypes();
    }

    loadVehicleTypes() {
        this.settingsService.getVehicleTypes().subscribe(types => this.vehicleTypes = types || []);
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
            sequenceMode: config.sequenceMode || 'Predefined',
            customSequence: config.customSequence || ['A', 'B', 'A', 'C'],
            qualiteCarburant: config.qualiteCarburant,
            actif: config.actif
        });
        this.openConfigModal();
    }

    openConfigModal() {
        this.dialog.open(this.configFormDialog, {
            width: '600px',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });
    }

    closeConfigModal() {
        this.dialog.closeAll();
        this.resetForm();
    }

    resetForm() {
        this.selectedConfig = null;
        this.configForm.reset({
            typeVehicule: '',
            conditionsRoute: 'Route mixte/urbaine',
            intervalleService: 5000,
            // Vidange fields removed
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
            // Vidange fields removed
            qualiteCarburant: formValue.qualiteCarburant,
            actif: formValue.actif
        };

        if (this.selectedConfig) {
            this.maintenanceService.updateConfig(this.selectedConfig._id, configData).subscribe({
                next: () => {
                    this.snackBar.open('Configuration mise à jour', 'OK', { duration: 3000 });
                    this.loadConfigs();
                    this.closeConfigModal();
                },
                error: (err) => console.error('Erreur MAJ config:', err)
            });
        } else {
            this.maintenanceService.createConfig(configData).subscribe({
                next: () => {
                    this.snackBar.open('Configuration sauvegardée', 'Fermer', { duration: 3000 });
                    this.loadConfigs();
                    this.closeConfigModal();
                },
                error: (err) => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
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
