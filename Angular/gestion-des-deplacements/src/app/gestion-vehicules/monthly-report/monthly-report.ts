import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { VehiculeService } from '../../vehicule.service';
import { LogbookService } from '../../logbook.service';
import { MaintenanceService } from '../../maintenance.service';
import { MouvementService } from '../../mouvement.service';

interface MonthlyReportRow {
    month: string;
    acfCode: string;
    base: string;
    owner: string;
    category: string;
    type: string;
    startMileage: number;
    endMileage: number;
    totalKm: number;
    fuelType: string;
    fuelQuantity: number;
    co2Emissions: number; // Émissions CO2 en kg
    fuelCost: number;
    consumption: number; // L/100km
    rentalCost: number;
    driverIncluded: boolean;
    maintenanceCost: number;
    repairCost: number;
    depreciationValue: number;
    depreciationAllocation: number;
    insuranceCost: number;
    otherCosts: number;
    totalCost: number;
    costPerKm: number;
    currency: string;
    totalEUR: number;
    completionRate?: number; // Taux de remplissage (checklists)
}

@Component({
    selector: 'app-monthly-report',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './monthly-report.html',
    styleUrls: ['./monthly-report.scss']
})
export class MonthlyReportComponent implements OnInit {
    filterForm!: FormGroup;
    displayedColumns: string[] = [
        'month', 'acfCode', 'base', 'owner', 'category', 'type',
        'startMileage', 'endMileage', 'totalKm', 'fuelType', 'fuelQuantity', 'co2Emissions',
        'fuelCost', 'consumption', 'rentalCost', 'driverIncluded',
        'maintenanceCost', 'repairCost', 'depreciationValue', 'depreciationAllocation',
        'insuranceCost', 'otherCosts', 'totalCost', 'costPerKm', 'currency', 'totalEUR', 'completionRate'
    ];
    dataSource: MonthlyReportRow[] = [];

    // Totaux environnementaux
    totalCO2: number = 0;
    totalFuel: number = 0;

    vehicles: any[] = [];

    constructor(
        private fb: FormBuilder,
        private vehiculeService: VehiculeService,
        private logbookService: LogbookService,
        private maintenanceService: MaintenanceService,
        private mouvementService: MouvementService
    ) { }

    ngOnInit() {
        // Initialize filter form
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        this.filterForm = this.fb.group({
            startDate: [firstDay],
            endDate: [lastDay],
            vehicleId: ['all']
        });

        // Load vehicles
        this.vehiculeService.getVehicules().subscribe(vehicles => {
            this.vehicles = vehicles;
            this.generateReport();
        });
    }

    async generateReport() {
        const { startDate, endDate, vehicleId } = this.filterForm.value;

        // Filter vehicles
        const selectedVehicles = vehicleId === 'all'
            ? this.vehicles
            : this.vehicles.filter(v => v._id === vehicleId);

        const reportRows: MonthlyReportRow[] = [];

        // Fetch all movements once (optimization possible: filter by date in backend)
        const allMovements = await this.mouvementService.getMouvements().toPromise() || [];

        for (const vehicle of selectedVehicles) {
            try {
                // Fetch data for this vehicle
                const fuels = await this.logbookService.getFuelsByVehicle(vehicle._id).toPromise();
                const maintenances = await this.logbookService.getMaintenancesByVehicle(vehicle._id).toPromise();
                const checklists = await this.maintenanceService.getWeeklyChecklistHistory(vehicle._id, 100).toPromise();

                // Filter movements for this vehicle
                const vehicleMovements = allMovements.filter(m => m.vehicule && (m.vehicule === vehicle._id || m.vehicule._id === vehicle._id));

                // Filter by date range
                const periodFuels = fuels?.filter(f => {
                    const fuelDate = new Date(f.date);
                    return fuelDate >= startDate && fuelDate <= endDate;
                }) || [];

                const periodMaintenances = maintenances?.filter(m => m.date && new Date(m.date) >= startDate && new Date(m.date) <= endDate) || [];

                const periodChecklists = checklists?.filter(c => {
                    const dateCreation = new Date(c.dateCreation);
                    return dateCreation >= startDate && dateCreation <= endDate;
                }) || [];

                // Filter movements specific to the period (completed movements with valid mileage)
                const periodMovements = vehicleMovements.filter(m => {
                    if (!m.dateArrivee) return false;
                    const dateArrivee = new Date(m.dateArrivee);
                    // Also ensure it has mileage data (completed trips)
                    const hasMileage = m.endMileage !== undefined && m.endMileage !== null;
                    return dateArrivee >= startDate && dateArrivee <= endDate && hasMileage;
                });

                // --- MILEAGE CALCULATION ---
                // 1. Find mileage BEFORE the period to handle Start Mileage correctly
                const eventsBefore: number[] = [];
                // Initial mileage
                if (vehicle.initialMileage) eventsBefore.push(vehicle.initialMileage);

                // Fuels before period
                const fuelsBefore = fuels?.filter(f => new Date(f.date) < startDate) || [];
                if (fuelsBefore.length > 0) eventsBefore.push(Math.max(...fuelsBefore.map(f => f.mileage)));

                // Movements before period
                const movementsBefore = vehicleMovements.filter(m => m.dateArrivee && new Date(m.dateArrivee) < startDate && m.endMileage);
                if (movementsBefore.length > 0) eventsBefore.push(Math.max(...movementsBefore.map(m => m.endMileage)));

                // Determine effective start mileage
                let startMileage = 0;
                if (eventsBefore.length > 0) {
                    startMileage = Math.max(...eventsBefore);
                } else {
                    // Fallback: If no history BEFORE, look for the EARLIEST EVENT START during the period
                    const startsDuring = periodMovements.map(m => m.startMileage).filter(k => k !== undefined && k !== null);
                    if (startsDuring.length > 0) {
                        startMileage = Math.min(...startsDuring);
                    } else if (vehicle.initialMileage) {
                        startMileage = vehicle.initialMileage;
                    }
                }

                // 2. Find max mileage within the period
                const eventsDuring: number[] = [];
                if (periodFuels.length > 0) eventsDuring.push(Math.max(...periodFuels.map(f => f.mileage)));
                if (periodMovements.length > 0) eventsDuring.push(Math.max(...periodMovements.map(m => m.endMileage)));

                // End mileage is max of (StartMileage, MaxMileageDuringPeriod)
                const endMileage = eventsDuring.length > 0 ? Math.max(startMileage, Math.max(...eventsDuring)) : startMileage;

                const totalKm = endMileage - startMileage;


                // Calculate Checklist Completion Rate (Taux de remplissage)
                const completionRate = periodChecklists.length > 0
                    ? periodChecklists.reduce((sum, c) => sum + (c.tauxCompletion || 0), 0) / periodChecklists.length
                    : 0;


                // Calculate fuel metrics
                const fuelQuantity = periodFuels.reduce((sum, f) => sum + (f.quantity || 0), 0);
                const fuelCost = periodFuels.reduce((sum, f) => sum + (f.price || 0), 0);
                const consumption = totalKm > 0 ? (fuelQuantity / totalKm) * 100 : 0;

                // ... (Costs calculation unchanged)
                const maintenanceCost = periodMaintenances
                    .filter(m => m.type !== 'Réparation')
                    .reduce((sum, m) => sum + (m.cost || 0), 0);

                const repairCost = periodMaintenances
                    .filter(m => m.type === 'Réparation')
                    .reduce((sum, m) => sum + (m.cost || 0), 0);

                const monthsDiff = this.getMonthsDifference(startDate, endDate);
                const depreciationValue = vehicle.purchaseValue || 0;
                const depreciationMonths = vehicle.depreciationMonths || 60;
                const depreciationAllocation = (depreciationValue / depreciationMonths) * monthsDiff;

                const insuranceCost = ((vehicle.insuranceCost || 0) / 12) * monthsDiff;

                const rentalCost = vehicle.owner === 'Location'
                    ? (vehicle.rentalCost || 0) * monthsDiff
                    : 0;

                const totalCost = fuelCost + maintenanceCost + repairCost +
                    depreciationAllocation + insuranceCost + rentalCost;

                const costPerKm = totalKm > 0 ? totalCost / totalKm : 0;
                const currency = 'USD';
                const totalEUR = totalCost;

                // Handle Base display safely
                let baseDisplay = '-';
                if (vehicle.base) {
                    if (typeof vehicle.base === 'string') {
                        baseDisplay = vehicle.base;
                    } else if (typeof vehicle.base === 'object') {
                        baseDisplay = vehicle.base.name || vehicle.base.nom || JSON.stringify(vehicle.base);
                        if (baseDisplay.startsWith('{')) baseDisplay = 'Base Inconnue';
                    }
                }

                // --- DEBUG LOGGING ---
                if (vehicle.immatriculation.includes('CD-FG-HJ') || vehicle.immatriculation.includes('MOB-002')) {
                    console.group(`[Report Debug] Vehicle ${vehicle.immatriculation}`);
                    console.log('Date Range:', startDate, endDate);
                    console.log('Initial Mileage:', vehicle.initialMileage);
                    console.log('Fuels Count:', fuels?.length);
                    console.log('Movements Total:', vehicleMovements.length);
                    // Updated debug log for new properties
                    console.log('Movements in Period:', periodMovements.map(m => `${m.startMileage}->${m.endMileage} (${m.dateArrivee})`));
                    console.log('Events Before:', eventsBefore);
                    console.log('Start Mileage (Calculated):', startMileage);
                    console.log('End Mileage (Calculated):', endMileage);
                    console.groupEnd();
                }

                reportRows.push({
                    month: this.formatMonth(startDate),
                    acfCode: vehicle.acfCode || '-',
                    base: baseDisplay,
                    owner: vehicle.owner || '-',
                    category: vehicle.category || '-',
                    type: vehicle.type || '-',
                    startMileage,
                    endMileage,
                    totalKm,
                    fuelType: vehicle.fuelType || '-',
                    fuelQuantity,
                    co2Emissions: this.calculateCarbonFootprint(vehicle, totalKm),
                    fuelCost,
                    consumption,
                    rentalCost,
                    driverIncluded: vehicle.driverIncluded || false,
                    maintenanceCost,
                    repairCost,
                    depreciationValue,
                    depreciationAllocation,
                    insuranceCost,
                    otherCosts: 0,
                    totalCost,
                    costPerKm,
                    currency,
                    totalEUR,
                    completionRate
                } as any);

            } catch (error) {
                console.error(`Error generating report for vehicle ${vehicle.immatriculation}:`, error);
            }
        }

        this.dataSource = reportRows;
    }

    private getMonthsDifference(start: Date, end: Date): number {
        const months = (end.getFullYear() - start.getFullYear()) * 12;
        return months + end.getMonth() - start.getMonth() + 1;
    }

    private formatMonth(date: Date): string {
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    }

    exportToExcel(): void {
        // Implémentation export Excel
        console.log('Export to Excel', this.dataSource);
        alert('Export Excel à implémenter');
    }

    // Calcul des émissions CO2 pour un mouvement
    calculateCarbonFootprint(vehicule: any, distance: number): number {
        if (!vehicule?.emissionsCO2?.valeur || !distance) {
            return 0;
        }
        // Émissions CO2 (g/km) × distance (km) / 1000 = kg
        return (vehicule.emissionsCO2.valeur * distance) / 1000;
    }

    // Calcul de la consommation carburant pour un mouvement
    calculateFuelConsumption(vehicule: any, distance: number): number {
        if (!vehicule?.consommation?.valeur || !distance) {
            return 0;
        }
        // Consommation (L/100km) × distance (km) / 100 = litres
        return (vehicule.consommation.valeur * distance) / 100;
    }

    // Calculer les totaux environnementaux
    calculateEnvironmentalTotals(logbookEntries: any[]): void {
        this.totalCO2 = 0;
        this.totalFuel = 0;

        logbookEntries.forEach(entry => {
            const distance = entry.kilometrageFin - entry.kilometrageDebut;
            this.totalCO2 += this.calculateCarbonFootprint(entry.vehicule, distance);
            this.totalFuel += this.calculateFuelConsumption(entry.vehicule, distance);
        });
    }
}
