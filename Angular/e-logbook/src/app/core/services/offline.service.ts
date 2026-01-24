import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface GpsPoint {
    lat: number;
    lng: number;
    timestamp: number; // Unix timestamp
    accuracy?: number;
    speed?: number;
    heading?: number;
}

export interface Trip {
    id?: number;
    serverId?: string; // Backend ID
    vehicleId: string;
    driverId: string;
    startDateTime: Date;
    endDateTime?: Date;
    startMileage: number;
    endMileage?: number;
    purpose: string;
    departurePlaceId?: string;
    arrivalPlaceId?: string;
    passengerIds?: string[];
    photos?: string[]; // URLs des photos
    gpsTrace?: GpsPoint[]; // NOUVEAU: Tracé GPS
    synced: number; // 0 = false, 1 = true
    plannedMovementId?: string; // ID of the planned movement if started from planning
}

// ... (Rest of interfaces unchanged)


export interface Fuel {
    id?: number;
    serverId?: string;
    vehicleId: string;
    driverId: string;
    date: Date;
    quantity: number;
    mileage: number;
    type: string;
    source: string;
    isFull?: boolean; // Indicates if it's a full tank refill
    price?: number; // Total cost
    photos?: string[]; // NOUVEAU: URLs des photos
    synced: number;
}

export interface Maintenance {
    id?: number;
    serverId?: string;
    vehicleId: string;
    date: Date;
    type: string;
    mileage: number;
    garage?: string;
    cost?: number;
    synced: number;
}

export interface Incident {
    id?: number;
    serverId?: string;
    vehicleId: string;
    driverId: string;
    date: Date;
    type: string;
    severity: string;
    description: string;
    cost?: number; // Cost related to the incident
    photos?: string[]; // NOUVEAU: URLs des photos Cloudinary
    synced: number;
}

export interface Lieu {
    _id: string;
    nom: string;
    adresse: string;
}

export interface User {
    _id: string;
    nom: string;
    email: string;
}

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
    enableGpsTracking?: boolean; // NOUVEAU
    capacitePassagers?: number;
    fuelType?: string;
}

export interface DeletedItem {
    id?: number;
    collection: string; // 'trips', 'fuels', etc.
    itemId: string; // The backend ID of the deleted item
    synced: number;
}

export interface SyncConfig {
    key: string; // 'lastSync'
    value: number; // timestamp
}

export interface ConsumptionData {
    // Accurate consumption (between full tanks)
    accurateConsumption?: number;      // L/100km
    accurateBasedOnRefills: number;    // Number of full tanks used

    // Estimated consumption (all refills)
    estimatedConsumption?: number;     // L/100km
    estimatedBasedOnRefills: number;   // Total number of refills

    // Reliability indicator
    reliability: 'high' | 'medium' | 'low';
}

@Injectable({
    providedIn: 'root'
})
export class OfflineService extends Dexie {
    trips!: Table<Trip, number>;
    fuels!: Table<Fuel, number>;
    maintenances!: Table<Maintenance, number>;
    incidents!: Table<Incident, number>;
    lieux!: Table<Lieu, string>;
    users!: Table<User, string>;
    vehicles!: Table<Vehicle, string>;
    deletedItems!: Table<DeletedItem, number>;
    syncConfig!: Table<SyncConfig, string>;

    constructor() {
        super('eLogbookDB');

        // Version 3: Add vehicles, deletedItems, syncConfig
        this.version(3).stores({
            trips: '++id, vehicleId, driverId, synced, date',
            fuels: '++id, vehicleId, driverId, synced, date',
            maintenances: '++id, vehicleId, synced, date',
            incidents: '++id, vehicleId, driverId, synced, date',
            lieux: '_id',
            users: '_id',
            vehicles: '_id',
            deletedItems: '++id, collection, itemId, synced',
            syncConfig: 'key'
        });

        // Version 4: Add serverId to syncable tables to prevent duplicates
        this.version(4).stores({
            trips: '++id, serverId, vehicleId, driverId, synced, startDateTime',
            fuels: '++id, serverId, vehicleId, driverId, synced, date',
            maintenances: '++id, serverId, vehicleId, synced, date',
            incidents: '++id, serverId, vehicleId, driverId, synced, date',
            lieux: '_id',
            users: '_id',
            vehicles: '_id',
            deletedItems: '++id, collection, itemId, synced',
            syncConfig: 'key'
        }).upgrade(tx => {
            // Clear all tables to force re-sync with serverId
            return tx.table('trips').clear()
                .then(() => tx.table('fuels').clear())
                .then(() => tx.table('maintenances').clear());
        });

        // Version 5: Add isFull to fuels for consumption calculation
        this.version(5).stores({
            trips: '++id, serverId, vehicleId, driverId, synced, startDateTime',
            fuels: '++id, serverId, vehicleId, driverId, synced, date, isFull',
            maintenances: '++id, serverId, vehicleId, synced, date',
            incidents: '++id, serverId, vehicleId, driverId, synced, date',
            lieux: '_id',
            users: '_id',
            vehicles: '_id',
            deletedItems: '++id, collection, itemId, synced',
            syncConfig: 'key'
        });
    }

    async addTrip(trip: Trip) {
        return await this.trips.add(trip);
    }

    async getUnsyncedTrips() {
        return await this.trips.where('synced').equals(0).toArray();
    }

    async addFuel(fuel: Fuel) {
        return await this.fuels.add(fuel);
    }

    async getUnsyncedFuels() {
        return await this.fuels.where('synced').equals(0).toArray();
    }

    async addMaintenance(maintenance: Maintenance) {
        return await this.maintenances.add(maintenance);
    }

    async getUnsyncedMaintenances() {
        return await this.maintenances.where('synced').equals(0).toArray();
    }

    async addIncident(incident: Incident) {
        return await this.incidents.add(incident);
    }

    async getUnsyncedIncidents() {
        return await this.incidents.where('synced').equals(0).toArray();
    }

    // Helper for Sync Config
    async getLastSyncTime(): Promise<number> {
        const config = await this.syncConfig.get('lastSync');
        return config ? config.value : 0;
    }

    async setLastSyncTime(timestamp: number) {
        await this.syncConfig.put({ key: 'lastSync', value: timestamp });
    }

    // Helper for Deleted Items
    async addDeletedItem(collection: string, itemId: string) {
        await this.deletedItems.add({
            collection,
            itemId,
            synced: 0
        });
    }

    async getUnsyncedDeletedItems() {
        return await this.deletedItems.where('synced').equals(0).toArray();
    }

    // Get last recorded mileage for a vehicle
    async getLastMileage(vehicleId: string): Promise<number> {
        console.log('🔍 [getLastMileage] Recherche dernier km pour véhicule:', vehicleId);

        const [lastTrip, lastFuel, lastMaintenance] = await Promise.all([
            this.trips.where('vehicleId').equals(vehicleId).reverse().sortBy('startDateTime'),
            this.fuels.where('vehicleId').equals(vehicleId).reverse().sortBy('date'),
            this.maintenances.where('vehicleId').equals(vehicleId).reverse().sortBy('date')
        ]);

        const mileages: number[] = [];

        // Vérifier TOUS les trips récents pour trouver le dernier endMileage
        console.log('📊 [getLastMileage] Trips trouvés:', lastTrip.length);
        if (lastTrip.length > 0) {
            // Chercher le premier trip avec endMileage
            const tripWithEndMileage = lastTrip.find(t => t.endMileage != null);
            if (tripWithEndMileage && tripWithEndMileage.endMileage) {
                console.log('✅ [getLastMileage] Trip avec endMileage trouvé:', tripWithEndMileage.endMileage);
                mileages.push(tripWithEndMileage.endMileage);
            } else if (lastTrip[0].startMileage) {
                console.log('⚠️ [getLastMileage] Aucun endMileage, utilisation startMileage:', lastTrip[0].startMileage);
                mileages.push(lastTrip[0].startMileage);
            }
        }

        if (lastFuel.length > 0) {
            console.log('⛽ [getLastMileage] Dernier fuel km:', lastFuel[0].mileage);
            mileages.push(lastFuel[0].mileage);
        }

        if (lastMaintenance.length > 0) {
            console.log('🔧 [getLastMileage] Dernière maintenance km:', lastMaintenance[0].mileage);
            mileages.push(lastMaintenance[0].mileage);
        }

        // NOUVEAU: Vérifier aussi le trip actif dans localStorage
        const activeTripData = localStorage.getItem('activeTrip');
        if (activeTripData) {
            try {
                const activeTrip = JSON.parse(activeTripData);
                // Vérifier que c'est bien le même véhicule
                if (activeTrip.vehicleId === vehicleId && activeTrip.startFormValue?.startMileage) {
                    mileages.push(activeTrip.startFormValue.startMileage);
                    console.log('🚗 [getLastMileage] Trip actif km:', activeTrip.startFormValue.startMileage);
                }
            } catch (error) {
                console.error('❌ [getLastMileage] Erreur lecture active trip:', error);
            }
        }

        const maxMileageStr = mileages.length > 0 ? Math.max(...mileages) : 0;

        // NOUVEAU: Vérifier le kilométrage initial du véhicule
        try {
            const vehicle = await this.vehicles.get(vehicleId);
            if (vehicle && (vehicle.initialMileage || (vehicle as any).kilometrageInitial)) {
                // Gérer les deux noms de propriétés possibles (mappage)
                const initialKm = vehicle.initialMileage || (vehicle as any).kilometrageInitial;
                console.log('🚗 [getLastMileage] Véhicule Km Initial:', initialKm);
                return Math.max(maxMileageStr, initialKm);
            }
        } catch (e) {
            console.error('Erreur lecture véhicule Dexie:', e);
        }

        console.log('🎯 [getLastMileage] Kilométrage maximum trouvé:', maxMileageStr, 'parmi:', mileages);
        return maxMileageStr;
    }

    // Calculate fuel consumption for a vehicle
    async calculateConsumption(vehicleId: string): Promise<ConsumptionData> {
        const allFuels = await this.fuels
            .where('vehicleId')
            .equals(vehicleId)
            .sortBy('date');

        const fullTankRefills = allFuels.filter(f => f.isFull === true);

        let accurateConsumption: number | undefined;
        let estimatedConsumption: number | undefined;
        let reliability: 'high' | 'medium' | 'low' = 'low';

        // Calculate accurate consumption (between full tanks)
        if (fullTankRefills.length >= 2) {
            const consumptions: number[] = [];
            for (let i = 1; i < fullTankRefills.length; i++) {
                const distance = fullTankRefills[i].mileage - fullTankRefills[i - 1].mileage;
                if (distance > 0) {
                    const consumption = (fullTankRefills[i].quantity / distance) * 100;
                    consumptions.push(consumption);
                }
            }
            if (consumptions.length > 0) {
                accurateConsumption = consumptions.reduce((a, b) => a + b, 0) / consumptions.length;
                reliability = 'high';
            }
        }

        // Calculate estimated consumption (all refills)
        if (allFuels.length >= 2) {
            const totalQuantity = allFuels.reduce((sum, f) => sum + f.quantity, 0);
            const totalDistance = allFuels[allFuels.length - 1].mileage - allFuels[0].mileage;
            if (totalDistance > 0) {
                estimatedConsumption = (totalQuantity / totalDistance) * 100;
                if (reliability === 'low') {
                    reliability = 'medium';
                }
            }
        }

        return {
            accurateConsumption,
            accurateBasedOnRefills: fullTankRefills.length,
            estimatedConsumption,
            estimatedBasedOnRefills: allFuels.length,
            reliability
        };
    }
}
