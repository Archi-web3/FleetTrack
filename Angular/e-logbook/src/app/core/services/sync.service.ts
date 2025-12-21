import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OfflineService } from './offline.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SyncService {
    private apiUrl = `${environment.apiUrl}/logbook/sync`;

    constructor(private http: HttpClient, private offlineService: OfflineService) { }

    async syncData() {
        if (!navigator.onLine) {
            console.log('Offline: Skipping sync');
            return;
        }

        console.log('Starting full synchronization...');

        // 1. Push Local Changes (Create/Update)
        await this.pushLocalChanges();

        // 2. Push Deletions
        await this.pushDeletions();

        // 3. Pull Server Changes (Reference Data + Recent Items)
        await this.pullServerChanges();

        console.log('Full synchronization completed.');
    }

    private async pushLocalChanges() {
        const trips = await this.offlineService.getUnsyncedTrips();
        const fuels = await this.offlineService.getUnsyncedFuels();
        const maintenances = await this.offlineService.getUnsyncedMaintenances();
        const incidents = await this.offlineService.getUnsyncedIncidents();

        if (trips.length === 0 && fuels.length === 0 && maintenances.length === 0 && incidents.length === 0) {
            console.log('No local changes to push.');
        } else {
            const payload = { trips, fuels, maintenances, incidents };
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token || '' };

            try {
                console.log('Pushing local changes:', payload);
                const response: any = await firstValueFrom(this.http.post(this.apiUrl, payload, { headers }));

                // Update serverIds and mark items as synced
                if (response.results) {
                    // Update trips with serverIds
                    if (response.results.trips && response.results.trips.items && Array.isArray(response.results.trips.items)) {
                        for (let i = 0; i < trips.length && i < response.results.trips.items.length; i++) {
                            const localTrip = trips[i];
                            const serverResult = response.results.trips.items[i];
                            if (localTrip.id && serverResult._id) {
                                await this.offlineService.trips.update(localTrip.id, {
                                    serverId: serverResult._id,
                                    synced: 1
                                });
                            }
                        }
                    }

                    // Update fuels with serverIds
                    if (response.results.fuels && response.results.fuels.items && Array.isArray(response.results.fuels.items)) {
                        for (let i = 0; i < fuels.length && i < response.results.fuels.items.length; i++) {
                            const localFuel = fuels[i];
                            const serverResult = response.results.fuels.items[i];
                            if (localFuel.id && serverResult._id) {
                                await this.offlineService.fuels.update(localFuel.id, {
                                    serverId: serverResult._id,
                                    synced: 1
                                });
                            }
                        }
                    }

                    // Update maintenances with serverIds
                    if (response.results.maintenances && response.results.maintenances.items && Array.isArray(response.results.maintenances.items)) {
                        for (let i = 0; i < maintenances.length && i < response.results.maintenances.items.length; i++) {
                            const localMaint = maintenances[i];
                            const serverResult = response.results.maintenances.items[i];
                            if (localMaint.id && serverResult._id) {
                                await this.offlineService.maintenances.update(localMaint.id, {
                                    serverId: serverResult._id,
                                    synced: 1
                                });
                            }
                        }
                    }

                    // Update incidents with serverIds
                    if (response.results.incidents && response.results.incidents.items && Array.isArray(response.results.incidents.items)) {
                        for (let i = 0; i < incidents.length && i < response.results.incidents.items.length; i++) {
                            const localInc = incidents[i];
                            const serverResult = response.results.incidents.items[i];
                            if (localInc.id && serverResult._id) {
                                await this.offlineService.incidents.update(localInc.id, {
                                    serverId: serverResult._id,
                                    synced: 1
                                });
                            }
                        }
                    }
                }
                console.log('Local changes pushed successfully with serverIds updated.');
            } catch (error) {
                console.error('Error pushing local changes:', error);
                throw error;
            }
        }
    }

    private async pushDeletions() {
        const deletedItems = await this.offlineService.getUnsyncedDeletedItems();
        if (deletedItems.length === 0) return;

        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };

        for (const item of deletedItems) {
            try {
                // Map collection name to API endpoint
                let endpoint = '';
                switch (item.collection) {
                    case 'trips': endpoint = 'mouvements'; break;
                    case 'fuels': endpoint = 'fuel'; break;
                    case 'maintenances': endpoint = 'maintenance'; break;
                    case 'incidents': endpoint = 'incidents'; break;
                }

                if (endpoint) {
                    try {
                        await firstValueFrom(this.http.delete(`${environment.apiUrl}/${endpoint}/${item.itemId}`, { headers }));
                        await this.offlineService.deletedItems.update(item.id!, { synced: 1 });
                    } catch (error: any) {
                        // If 404, it means already deleted on server, so we can mark as synced
                        if (error.status === 404) {
                            console.warn(`Item ${item.collection} ${item.itemId} already deleted on server (404). Marking as synced.`);
                            await this.offlineService.deletedItems.update(item.id!, { synced: 1 });
                        } else {
                            console.error(`Error syncing deletion for ${item.collection} ${item.itemId}:`, error);
                        }
                    }
                }
            } catch (error) {
                console.error(`Unexpected error processing deletion item ${item.id}:`, error);
            }
        }
        console.log('Deletions pushed successfully.');
    }

    private async pullServerChanges() {
        // Sync Reference Data first
        await this.syncReferenceData();

        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };

        // Calculate date for 3 months ago
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        try {
            // Pull Vehicles
            const vehicles: any[] = await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/vehicules`, { headers }));
            await this.offlineService.vehicles.clear();
            await this.offlineService.vehicles.bulkPut(vehicles);
            console.log(`Vehicles synced: ${vehicles.length} items`);

            // Pull Trips (last 3 months) - From /mouvements
            const trips: any[] = await firstValueFrom(
                this.http.get<any[]>(`${environment.apiUrl}/mouvements`, { headers })
            );

            // Get selected vehicle ID for filtering
            const currentVehicleStr = localStorage.getItem('selectedVehicle');
            let selectedVehicleId: string | null = null;
            if (currentVehicleStr) {
                try {
                    const v = JSON.parse(currentVehicleStr);
                    selectedVehicleId = v._id;
                } catch (e) { console.error('Error parsing selected vehicle', e); }
            }

            const recentTrips = trips.filter(trip => {
                // Filter by date (last 3 months)
                const tripDate = trip.stops && trip.stops.length > 0
                    ? new Date(trip.stops[0].dateDepart)
                    : new Date();
                const isRecent = tripDate >= threeMonthsAgo;

                // Filter by vehicle if selected
                let isForVehicle = true;
                if (selectedVehicleId) {
                    const tripVehicleId = trip.vehicule?._id || trip.vehicule;
                    isForVehicle = tripVehicleId === selectedVehicleId;
                }

                return isRecent && isForVehicle;
            });

            const backendTripIds = new Set(recentTrips.map(t => t._id));

            for (const trip of recentTrips) {
                const firstStop = trip.stops && trip.stops.length > 0 ? trip.stops[0] : null;
                const lastStop = trip.stops && trip.stops.length > 0 ? trip.stops[trip.stops.length - 1] : null;

                // Check if exists by serverId - CRITICAL: This must work correctly
                const existingTrip = await this.offlineService.trips.where('serverId').equals(trip._id).first();

                console.log('Processing trip from backend:', {
                    serverId: trip._id,
                    objectif: trip.objectif,
                    purpose: trip.purpose,
                    existingTrip: existingTrip ? { id: existingTrip.id, purpose: existingTrip.purpose, serverId: existingTrip.serverId } : null
                });

                const tripData = {
                    serverId: trip._id,
                    vehicleId: trip.vehicule?._id || trip.vehicule,
                    driverId: trip.chauffeur?._id || trip.chauffeur,
                    startDateTime: firstStop ? new Date(firstStop.dateDepart) : new Date(),
                    endDateTime: lastStop && lastStop.dateArrivee ? new Date(lastStop.dateArrivee) : undefined,
                    startMileage: trip.startMileage || 0,
                    endMileage: trip.endMileage,
                    purpose: trip.objectif || trip.purpose || 'Déplacement',
                    departurePlaceId: firstStop?.lieu?._id || firstStop?.lieu,
                    arrivalPlaceId: lastStop?.lieu?._id || lastStop?.lieu,
                    passengerIds: trip.passagers?.map((p: any) => p._id || p) || [],
                    synced: 1
                };

                if (existingTrip && existingTrip.id) {
                    // Update existing trip
                    await this.offlineService.trips.update(existingTrip.id, tripData);
                    console.log('Updated existing trip:', existingTrip.id, 'with serverId:', trip._id);
                } else {
                    // Add new trip ONLY if it doesn't exist
                    await this.offlineService.trips.add(tripData);
                    console.log('Added new trip from backend with serverId:', trip._id);
                }
            }

            // Delete local trips that no longer exist on backend (for selected vehicle)
            if (selectedVehicleId) {
                const localTrips = await this.offlineService.trips
                    .where('vehicleId')
                    .equals(selectedVehicleId)
                    .toArray();

                for (const localTrip of localTrips) {
                    if (localTrip.serverId && !backendTripIds.has(localTrip.serverId)) {
                        if (localTrip.id) {
                            await this.offlineService.trips.delete(localTrip.id);
                            console.log(`Deleted trip ${localTrip.serverId} (removed from backend)`);
                        }
                    }
                }
            }

            console.log(`Trips synced: ${recentTrips.length} items (filtered from ${trips.length})`);

            if (!selectedVehicleId) {
                console.warn('No vehicle selected, skipping fuel/maintenance/incidents sync');
                return;
            }

            // Pull Fuels for selected vehicle only
            const fuels: any[] = await firstValueFrom(
                this.http.get<any[]>(`${environment.apiUrl}/logbook/fuels/${selectedVehicleId}`, { headers })
            );

            // Fuels already filtered by vehicle on backend
            const backendFuelIds = new Set(fuels.map(f => f._id));

            for (const fuel of fuels) {
                const existingFuel = await this.offlineService.fuels.where('serverId').equals(fuel._id).first();
                const fuelData = {
                    serverId: fuel._id,
                    vehicleId: fuel.vehicule?._id || fuel.vehicule || fuel.vehicleId,
                    driverId: fuel.chauffeur?._id || fuel.chauffeur || fuel.driverId,
                    date: new Date(fuel.date),
                    quantity: fuel.quantity,
                    mileage: fuel.mileage,
                    type: fuel.fuelType,
                    source: fuel.source,
                    isFull: fuel.fullTank !== undefined ? fuel.fullTank : true, // Map backend fullTank to frontend isFull
                    synced: 1
                };

                if (existingFuel && existingFuel.id) {
                    await this.offlineService.fuels.update(existingFuel.id, fuelData);
                } else {
                    await this.offlineService.fuels.add(fuelData);
                }
            }

            // Delete local fuels that no longer exist on backend (for selected vehicle)
            const localFuels = await this.offlineService.fuels
                .where('vehicleId')
                .equals(selectedVehicleId)
                .toArray();

            for (const localFuel of localFuels) {
                if (localFuel.serverId && !backendFuelIds.has(localFuel.serverId)) {
                    // This fuel was deleted on backend, remove it locally
                    if (localFuel.id) {
                        await this.offlineService.fuels.delete(localFuel.id);
                        console.log(`Deleted fuel ${localFuel.serverId} (removed from backend)`);
                    }
                }
            }

            console.log(`Fuels synced: ${fuels.length} items`);

            // Pull Maintenances for selected vehicle
            const maintenances: any[] = await firstValueFrom(
                this.http.get<any[]>(`${environment.apiUrl}/logbook/maintenances/${selectedVehicleId}`, { headers })
            );

            // Maintenances already filtered by vehicle on backend
            const backendMaintenanceIds = new Set(maintenances.map(m => m._id));

            for (const maintenance of maintenances) {
                const existingMaint = await this.offlineService.maintenances.where('serverId').equals(maintenance._id).first();
                const maintData = {
                    serverId: maintenance._id,
                    vehicleId: maintenance.vehicule?._id || maintenance.vehicule || maintenance.vehicleId,
                    date: new Date(maintenance.date),
                    type: maintenance.type,
                    mileage: maintenance.mileage,
                    garage: maintenance.garage,
                    cost: maintenance.cost,
                    synced: 1
                };

                if (existingMaint && existingMaint.id) {
                    await this.offlineService.maintenances.update(existingMaint.id, maintData);
                } else {
                    await this.offlineService.maintenances.add(maintData);
                }
            }

            // Delete local maintenances that no longer exist on backend
            const localMaintenances = await this.offlineService.maintenances
                .where('vehicleId')
                .equals(selectedVehicleId)
                .toArray();

            for (const localMaint of localMaintenances) {
                if (localMaint.serverId && !backendMaintenanceIds.has(localMaint.serverId)) {
                    if (localMaint.id) {
                        await this.offlineService.maintenances.delete(localMaint.id);
                        console.log(`Deleted maintenance ${localMaint.serverId} (removed from backend)`);
                    }
                }
            }

            console.log(`Maintenances synced: ${maintenances.length} items`);

            // Pull Incidents for selected vehicle
            try {
                const incidents: any[] = await firstValueFrom(
                    this.http.get<any[]>(`${environment.apiUrl}/logbook/incidents/${selectedVehicleId}`, { headers })
                );

                // Incidents already filtered by vehicle on backend
                const backendIncidentIds = new Set(incidents.map(i => i._id));

                for (const incident of incidents) {
                    const existingInc = await this.offlineService.incidents.where('serverId').equals(incident._id).first();
                    const incData = {
                        serverId: incident._id,
                        vehicleId: incident.vehicule?._id || incident.vehicule || incident.vehicleId,
                        driverId: incident.chauffeur?._id || incident.chauffeur || incident.driverId,
                        date: new Date(incident.date),
                        type: incident.type,
                        severity: incident.severity,
                        description: incident.description,
                        synced: 1
                    };

                    if (existingInc && existingInc.id) {
                        await this.offlineService.incidents.update(existingInc.id, incData);
                    } else {
                        await this.offlineService.incidents.add(incData);
                    }
                }

                // Delete local incidents that no longer exist on backend
                const localIncidents = await this.offlineService.incidents
                    .where('vehicleId')
                    .equals(selectedVehicleId)
                    .toArray();

                for (const localInc of localIncidents) {
                    if (localInc.serverId && !backendIncidentIds.has(localInc.serverId)) {
                        if (localInc.id) {
                            await this.offlineService.incidents.delete(localInc.id);
                            console.log(`Deleted incident ${localInc.serverId} (removed from backend)`);
                        }
                    }
                }

                console.log(`Incidents synced: ${incidents.length} items`);
            } catch (error) {
                console.warn('Incidents endpoint might not exist:', error);
            }

            console.log('Pull sync completed successfully.');
        } catch (error) {
            console.error('Error pulling server changes:', error);
        }
    }

    async syncReferenceData() {
        console.log('Syncing reference data (Lieux, Users)...');
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };

        try {
            const lieux: any[] = await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/lieux`, { headers }));
            await this.offlineService.lieux.clear();
            await this.offlineService.lieux.bulkPut(lieux);

            const users: any[] = await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/utilisateurs`, { headers }));
            await this.offlineService.users.clear();
            await this.offlineService.users.bulkPut(users);

            console.log('Reference data synced.');
        } catch (error) {
            console.error('Error syncing reference data:', error);
        }
    }

    private async markAsSynced(items: any[], table: any) {
        for (const item of items) {
            if (item.id) {
                await table.update(item.id, { synced: 1 });
            }
        }
    }
}
