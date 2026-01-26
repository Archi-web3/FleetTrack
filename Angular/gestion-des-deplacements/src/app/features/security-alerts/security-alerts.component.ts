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
import { VehiculeService } from '../../vehicule.service'; // Assurez-vous que ce service existe pour lister les véhicules

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
        MatChipsModule
    ],
    templateUrl: './security-alerts.component.html',
    styleUrls: ['./security-alerts.scss']
})
export class SecurityAlertsComponent implements OnInit {
    alertForm: FormGroup;
    vehicles: any[] = [];
    history: Alert[] = [];
    displayedColumns: string[] = ['date', 'title', 'severity', 'target', 'readCount'];

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
        this.alertService.getAllAlerts().subscribe(
            data => this.history = data,
            err => console.error('Erreur chargement historique', err)
        );
    }

    onSubmit(): void {
        if (this.alertForm.invalid) return;

        const newAlert: Alert = this.alertForm.value;

        this.alertService.createAlert(newAlert).subscribe({
            next: (res) => {
                this.snackBar.open('Alerte envoyée avec succès ! 🚀', 'Fermer', { duration: 3000 });
                this.alertForm.reset({ severity: 'info', targetType: 'all' });
                // Recharger l'historique pour voir la nouvelle alerte
                this.loadHistory();
            },
            error: (err) => {
                this.snackBar.open('Erreur lors de l\'envoi de l\'alerte.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
                console.error(err);
            }
        });
    }

    getVehicleName(id: string): string {
        const v = this.vehicles.find(veh => veh._id === id);
        return v ? `${v.marque} ${v.modele} (${v.immatriculation})` : id;
    }
}
