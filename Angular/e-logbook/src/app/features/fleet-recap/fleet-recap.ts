import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OfflineService, Vehicle, Maintenance } from '../../core/services/offline.service';

interface VehicleRecap extends Vehicle {
    lastMaintenanceMileage?: number;
    lastServiceType?: string;
}

@Component({
    selector: 'app-fleet-recap',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
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
        private offlineService: OfflineService,
        private router: Router
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        const vehicles = await this.offlineService.vehicles.toArray();
        const maintenances = await this.offlineService.maintenances.toArray();

        this.dataSource = vehicles.map(v => {
            // Find last maintenance for this vehicle
            const vehicleMaintenances = maintenances
                .filter(m => m.vehicleId === v._id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const lastMaint = vehicleMaintenances.length > 0 ? vehicleMaintenances[0] : undefined;

            return {
                ...v,
                lastMaintenanceMileage: lastMaint?.mileage,
                lastServiceType: lastMaint?.type
            };
        });
    }

    editVehicle(vehicle: Vehicle) {
        this.router.navigate(['/vehicle/edit', vehicle._id]);
    }

    addVehicle() {
        this.router.navigate(['/vehicle/new']);
    }
}
