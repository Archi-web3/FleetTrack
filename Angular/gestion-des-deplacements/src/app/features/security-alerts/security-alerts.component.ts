import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { SecurityAlertService, Alert } from './security-alert.service';
import { VehiculeService } from '../../core/services/vehicule.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-security-alerts',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSnackBarModule,
        MatChipsModule,
        TextFieldModule,
        TranslateModule
    ],
    templateUrl: './security-alerts.component.html',
    styleUrls: ['./security-alerts.scss']
})
export class SecurityAlertsComponent implements OnInit {
    alertForm: FormGroup;
    vehicles: any[] = [];
    history: Alert[] = [];
    displayedColumns: string[] = ['date', 'title', 'severity', 'target', 'readCount', 'actions'];

    constructor(
        private fb: FormBuilder,
        private alertService: SecurityAlertService,
        private vehicleService: VehiculeService,
        private snackBar: MatSnackBar
    ) {
        this.alertForm = this.fb.group({
            title: ['', Validators.required],
            message: ['', Validators.required],
            severity: ['info', Validators.required],
            targetType: ['all', Validators.required],
            targetVehicleId: ['']
        });
    }

    ngOnInit(): void {
        this.loadVehicles();
        this.loadHistory();

        // Gestion conditionnelle du champ véhicule
        this.alertForm.get('targetType')?.valueChanges.subscribe(val => {
            const vehicleControl = this.alertForm.get('targetVehicleId');
            if (val === 'vehicle') {
                vehicleControl?.setValidators(Validators.required);
            } else {
                vehicleControl?.clearValidators();
                vehicleControl?.setValue('');
            }
            vehicleControl?.updateValueAndValidity();
        });
    }

    loadVehicles(): void {
        this.vehicleService.getVehicules().subscribe(v => this.vehicles = v);
    }

    loadHistory(): void {
        console.log('🔄 [SecurityAlerts] Chargement de l\'historique...');
        this.alertService.getAllAlerts().subscribe(
            data => {
                console.log(`✅ [SecurityAlerts] ${data.length} alertes chargées.`);
                this.history = data;
            },
            err => console.error('❌ [SecurityAlerts] Erreur chargement historique', err)
        );
    }

    onSubmit(): void {
        if (this.alertForm.invalid) {
            console.warn('⚠️ [SecurityAlerts] Formulaire invalide', this.alertForm.errors);
            return;
        }

        const newAlert: Alert = this.alertForm.value;
        console.log('🚀 [SecurityAlerts] Envoi de l\'alerte:', newAlert);

        this.alertService.createAlert(newAlert).subscribe({
            next: (res) => {
                console.log('✅ [SecurityAlerts] Alerte créée avec succès:', res);
                this.snackBar.open('Alerte envoyée avec succès ! 🚀', 'Fermer', { duration: 3000 });
                // Reset partiel pour garder le contexte si besoin, mais on vide le message
                this.alertForm.patchValue({ title: '', message: '', severity: 'info' });
                this.alertForm.markAsPristine();
                this.alertForm.markAsUntouched();

                this.loadHistory();
            },
            error: (err) => {
                console.error('❌ [SecurityAlerts] Erreur lors de l\'envoi:', err);
                this.snackBar.open('Erreur lors de l\'envoi de l\'alerte.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
            }
        });
    }

    getVehicleName(id: string): string {
        const v = this.vehicles.find(veh => veh._id === id);
        return v ? `${v.marque} ${v.modele} (${v.immatriculation})` : id;
    }

    deleteAlert(alert: Alert): void {
        if (!alert._id) return;
        if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette alerte ?')) {
            this.alertService.deleteAlert(alert._id).subscribe({
                next: () => {
                    this.snackBar.open('Alerte supprimée', 'Fermer', { duration: 3000 });
                    this.loadHistory();
                },
                error: (err) => {
                    console.error('Erreur suppression', err);
                    this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
                }
            });
        }
    }
}
