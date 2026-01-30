import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { VehiculeService } from '../../vehicule.service';
import { LogbookService } from '../../logbook.service';
import { TranslateModule } from '@ngx-translate/core';

// Define interface locally or import if I create a model file
export interface Vehicle {
    _id: string;
    marque: string;
    modele: string;
    immatriculation: string;
    type: string;

    // New Fields
    acfCode?: string;
    base?: string;
    owner?: 'ACF' | 'Location';
    category?: 'Voiture' | 'Camion' | 'Moto';
    year?: number;
    startDate?: Date;
    purchaseValue?: number;
    depreciationMonths?: number;
    insuranceCost?: number;
    insuranceEndDate?: Date;
    initialMileage?: number;
    rentalCost?: number;
    driverIncluded?: boolean;
    remarks?: string;

    enService?: boolean;
    capacitePassagers?: number;
    fuelType?: string;
}

interface VehicleRecap extends Vehicle {
    lastMaintenanceMileage?: number;
    lastServiceType?: string;
}

@Component({
    selector: 'app-fleet-recap',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatIconModule,
        MatCardModule,
        TranslateModule
    ],
    templateUrl: './fleet-recap.html',
    styleUrls: ['./fleet-recap.scss']
})
export class FleetRecapComponent implements OnInit {
    displayedColumns: string[] = [
        'acfCode', 'base', 'owner', 'category', 'type',
        'immatriculation', 'marque', 'modele', 'fuelType',
        'year', 'startDate', 'purchaseValue', 'depreciationMonths',
        'insuranceCost', 'insuranceEndDate', 'initialMileage',
        'lastMaintenanceMileage', 'lastServiceType', 'remarks', 'actions'
    ];
    dataSource: VehicleRecap[] = [];

    constructor(
        private vehiculeService: VehiculeService,
        private logbookService: LogbookService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.vehiculeService.getVehicules().subscribe(async (vehicles: Vehicle[]) => {
            const vehicleRecaps: VehicleRecap[] = [];

            // For each vehicle, fetch maintenance data
            // Note: This might be slow for many vehicles. 
            // Ideally backend should provide this, but for now we loop.
            for (const v of vehicles) {
                const recap: VehicleRecap = {
                    ...v,
                    // Map backend field names to frontend field names
                    initialMileage: (v as any).kilometrageInitial || v.initialMileage
                };

                try {
                    // We convert Observable to Promise for easier async/await loop
                    // or we could use forkJoin if we want parallel
                    const maintenances = await this.logbookService.getMaintenancesByVehicle(v._id).toPromise();

                    if (maintenances && maintenances.length > 0) {
                        // Sort by date desc (assuming backend sorts, but let's be safe)
                        // Backend sort is: .sort({ date: -1 }) so [0] is latest
                        const lastMaint = maintenances[0];
                        recap.lastMaintenanceMileage = lastMaint.mileage;
                        recap.lastServiceType = lastMaint.type;
                    }
                } catch (err) {
                    console.error(`Error loading maintenance for ${v.immatriculation}`, err);
                }

                vehicleRecaps.push(recap);
            }

            this.dataSource = vehicleRecaps;
        });
    }

    editVehicle(vehicle: Vehicle) {
        this.router.navigate(['/gestion-vehicules/edit', vehicle._id]);
    }

    addVehicle() {
        this.router.navigate(['/gestion-vehicules/new']);
    }
}
