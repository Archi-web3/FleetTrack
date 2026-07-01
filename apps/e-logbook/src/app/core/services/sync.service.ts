import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OfflineService, Trip } from './offline.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SyncResponse,
  ServerTrip,
  ServerFuel,
  ServerMaintenance,
  ServerIncident,
  ServerVehicle,
  ServerLieu,
  ServerUser,
  HttpErrorResponse,
} from '../models/api.types';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private http = inject(HttpClient);
  private offlineService = inject(OfflineService);

  private apiUrl = `${environment.apiUrl}/logbook/sync`;

  async syncData() {
    if (!navigator.onLine) {
      return;
    }

    // 1. Push Local Changes (Create/Update)
    await this.pushLocalChanges();

    // 2. Push Deletions
    await this.pushDeletions();

    // 3. Pull Server Changes (Reference Data + Recent Items)
    await this.pullServerChanges();
  }

  private async pushLocalChanges() {
    const trips = await this.offlineService.getUnsyncedTrips();
    const fuels = await this.offlineService.getUnsyncedFuels();
    const maintenances = await this.offlineService.getUnsyncedMaintenances();
    const incidents = await this.offlineService.getUnsyncedIncidents();

    if (
      trips.length === 0 &&
      fuels.length === 0 &&
      maintenances.length === 0 &&
      incidents.length === 0
    ) {
      return;
    }

    const payload = { trips, fuels, maintenances, incidents };

    try {
      const response = await firstValueFrom(
        this.http.post<SyncResponse>(this.apiUrl, payload)
      );

      if (response?.results) {
        // Update trips with serverIds
        if (Array.isArray(response.results.trips?.items)) {
          for (let i = 0; i < trips.length && i < response.results.trips!.items!.length; i++) {
            const localTrip = trips[i];
            const serverResult = response.results.trips!.items![i];
            if (localTrip.id && serverResult._id) {
              await this.offlineService.trips.update(localTrip.id, {
                serverId: serverResult._id,
                synced: 1,
              });
            }
          }
        }

        // Update fuels with serverIds
        if (Array.isArray(response.results.fuels?.items)) {
          for (let i = 0; i < fuels.length && i < response.results.fuels!.items!.length; i++) {
            const localFuel = fuels[i];
            const serverResult = response.results.fuels!.items![i];
            if (localFuel.id && serverResult._id) {
              await this.offlineService.fuels.update(localFuel.id, {
                serverId: serverResult._id,
                synced: 1,
              });
            }
          }
        }

        // Update maintenances with serverIds
        if (Array.isArray(response.results.maintenances?.items)) {
          for (
            let i = 0;
            i < maintenances.length && i < response.results.maintenances!.items!.length;
            i++
          ) {
            const localMaint = maintenances[i];
            const serverResult = response.results.maintenances!.items![i];
            if (localMaint.id && serverResult._id) {
              await this.offlineService.maintenances.update(localMaint.id, {
                serverId: serverResult._id,
                synced: 1,
              });
            }
          }
        }

        // Update incidents with serverIds
        if (Array.isArray(response.results.incidents?.items)) {
          for (
            let i = 0;
            i < incidents.length && i < response.results.incidents!.items!.length;
            i++
          ) {
            const localInc = incidents[i];
            const serverResult = response.results.incidents!.items![i];
            if (localInc.id && serverResult._id) {
              await this.offlineService.incidents.update(localInc.id, {
                serverId: serverResult._id,
                synced: 1,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error pushing local changes:', error);
      throw error;
    }
  }

  private async pushDeletions() {
    const deletedItems = await this.offlineService.getUnsyncedDeletedItems();
    if (deletedItems.length === 0) return;

    for (const item of deletedItems) {
      try {
        let endpoint = '';
        switch (item.collection) {
          case 'trips':
            endpoint = 'mouvements';
            break;
          case 'fuels':
            endpoint = 'fuel';
            break;
          case 'maintenances':
            endpoint = 'maintenance';
            break;
          case 'incidents':
            endpoint = 'incidents';
            break;
        }

        if (endpoint) {
          try {
            await firstValueFrom(
              this.http.delete(`${environment.apiUrl}/${endpoint}/${item.itemId}`),
            );
            await this.offlineService.deletedItems.update(item.id!, { synced: 1 });
          } catch (error) {
            const httpError = error as HttpErrorResponse;
            // If 404, it means already deleted on server — mark as synced
            if (httpError.status === 404) {
              console.warn(
                `Item ${item.collection} ${item.itemId} already deleted on server (404). Marking as synced.`,
              );
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
  }

  private async pullServerChanges() {
    await this.syncReferenceData();

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    try {
      // Pull Vehicles
      const vehicles = await firstValueFrom(
        this.http.get<ServerVehicle[]>(`${environment.apiUrl}/vehicules`),
      );
      await this.offlineService.vehicles.clear();
      await this.offlineService.vehicles.bulkPut(vehicles);

      // Pull Trips
      const trips = await firstValueFrom(
        this.http.get<ServerTrip[]>(`${environment.apiUrl}/mouvements`),
      );

      const currentVehicleStr = localStorage.getItem('selectedVehicle');
      let selectedVehicleId: string | null = null;
      if (currentVehicleStr) {
        try {
          const v: { _id?: string } = JSON.parse(currentVehicleStr);
          selectedVehicleId = v._id ?? null;
        } catch (e) {
          console.error('Error parsing selected vehicle', e);
        }
      }

      const recentTrips = trips.filter((trip) => {
        const tripDate =
          trip.stops && trip.stops.length > 0 ? new Date(trip.stops[0].dateDepart) : new Date();
        const isRecent = tripDate >= threeMonthsAgo;

        let isForVehicle = true;
        if (selectedVehicleId) {
          const vehicule = trip.vehicule;
          const tripVehicleId = typeof vehicule === 'object' ? vehicule?._id : vehicule;
          isForVehicle = tripVehicleId === selectedVehicleId;
        }

        return isRecent && isForVehicle;
      });

      const backendTripIds = new Set(recentTrips.map((t) => t._id));

      for (const trip of recentTrips) {
        const firstStop = trip.stops && trip.stops.length > 0 ? trip.stops[0] : null;
        const lastStop =
          trip.stops && trip.stops.length > 0 ? trip.stops[trip.stops.length - 1] : null;

        const existingTrip = await this.offlineService.trips
          .where('serverId')
          .equals(trip._id)
          .first();

        const chauffeur = trip.chauffeur;
        const driverId = typeof chauffeur === 'object' ? chauffeur?._id : chauffeur ?? '';

        const departLieu = firstStop?.lieu;
        const arrivalLieu = lastStop?.lieu;

        const tripData = {
          serverId: trip._id,
          vehicleId: typeof trip.vehicule === 'object' ? trip.vehicule?._id ?? '' : trip.vehicule ?? '',
          driverId: driverId ?? '',
          startDateTime: firstStop ? new Date(firstStop.dateDepart) : new Date(),
          endDateTime:
            lastStop?.dateArrivee ? new Date(lastStop.dateArrivee) : undefined,
          startMileage: trip.startMileage || 0,
          endMileage: trip.endMileage,
          purpose: trip.objectif || trip.purpose || 'Déplacement',
          departurePlaceId: typeof departLieu === 'object' && departLieu !== null ? (departLieu as unknown as { _id?: string })._id : String(departLieu),
          arrivalPlaceId: typeof arrivalLieu === 'object' && arrivalLieu !== null ? (arrivalLieu as unknown as { _id?: string })._id : String(arrivalLieu),
          passengerIds: trip.passagers?.map((p) => (typeof p === 'object' && p !== null ? (p as unknown as { _id?: string })._id : String(p))) || [],
          gpsTrace: trip.gpsTrace,
          synced: 1,
        };

        if (existingTrip && existingTrip.id) {
          await this.offlineService.trips.update(existingTrip.id, tripData as any);
        } else {
          await this.offlineService.trips.add(tripData as Trip);
        }
      }

      if (selectedVehicleId) {
        const localTrips = await this.offlineService.trips
          .where('vehicleId')
          .equals(selectedVehicleId)
          .toArray();

        for (const localTrip of localTrips) {
          if (localTrip.serverId && !backendTripIds.has(localTrip.serverId)) {
            if (localTrip.id) {
              await this.offlineService.trips.delete(localTrip.id);
            }
          }
        }
      }

      if (!selectedVehicleId) {
        console.warn('No vehicle selected, skipping fuel/maintenance/incidents sync');
        return;
      }

      // Pull Fuels
      const fuels = await firstValueFrom(
        this.http.get<ServerFuel[]>(`${environment.apiUrl}/logbook/fuels/${selectedVehicleId}`),
      );

      const backendFuelIds = new Set(fuels.map((f) => f._id));

      for (const fuel of fuels) {
        const vehicule = fuel.vehicule;
        const existingFuel = await this.offlineService.fuels
          .where('serverId')
          .equals(fuel._id)
          .first();
        const chauffeur = fuel.chauffeur;
        const fuelData = {
          serverId: fuel._id,
          vehicleId: typeof vehicule === 'object' ? vehicule?._id ?? '' : vehicule ?? fuel.vehicleId ?? '',
          driverId: typeof chauffeur === 'object' ? chauffeur?._id ?? '' : chauffeur ?? fuel.driverId ?? '',
          date: new Date(fuel.date),
          quantity: fuel.quantity,
          mileage: fuel.mileage,
          type: fuel.fuelType ?? fuel.type ?? '',
          source: fuel.source,
          isFull: fuel.fullTank !== undefined ? fuel.fullTank : true,
          synced: 1,
        };

        if (existingFuel && existingFuel.id) {
          await this.offlineService.fuels.update(existingFuel.id, fuelData);
        } else {
          await this.offlineService.fuels.add(fuelData);
        }
      }

      const localFuels = await this.offlineService.fuels
        .where('vehicleId')
        .equals(selectedVehicleId)
        .toArray();

      for (const localFuel of localFuels) {
        if (localFuel.serverId && !backendFuelIds.has(localFuel.serverId)) {
          if (localFuel.id) {
            await this.offlineService.fuels.delete(localFuel.id);
          }
        }
      }

      // Pull Maintenances
      const maintenances = await firstValueFrom(
        this.http.get<ServerMaintenance[]>(`${environment.apiUrl}/logbook/maintenances/${selectedVehicleId}`),
      );

      const backendMaintenanceIds = new Set(maintenances.map((m) => m._id));

      for (const maintenance of maintenances) {
        const existingMaint = await this.offlineService.maintenances
          .where('serverId')
          .equals(maintenance._id)
          .first();
        const vehicule = maintenance.vehicule;
        const maintData = {
          serverId: maintenance._id,
          vehicleId: typeof vehicule === 'object' ? vehicule?._id ?? '' : vehicule ?? maintenance.vehicleId ?? '',
          date: new Date(maintenance.date),
          type: maintenance.type,
          mileage: maintenance.mileage,
          garage: maintenance.garage,
          cost: maintenance.cost,
          synced: 1,
        };

        if (existingMaint && existingMaint.id) {
          await this.offlineService.maintenances.update(existingMaint.id, maintData);
        } else {
          await this.offlineService.maintenances.add(maintData);
        }
      }

      const localMaintenances = await this.offlineService.maintenances
        .where('vehicleId')
        .equals(selectedVehicleId)
        .toArray();

      for (const localMaint of localMaintenances) {
        if (localMaint.serverId && !backendMaintenanceIds.has(localMaint.serverId)) {
          if (localMaint.id) {
            await this.offlineService.maintenances.delete(localMaint.id);
          }
        }
      }

      // Pull Incidents
      try {
        const incidents = await firstValueFrom(
          this.http.get<ServerIncident[]>(`${environment.apiUrl}/logbook/incidents/${selectedVehicleId}`),
        );

        const backendIncidentIds = new Set(incidents.map((i) => i._id));

        for (const incident of incidents) {
          const existingInc = await this.offlineService.incidents
            .where('serverId')
            .equals(incident._id)
            .first();
          const vehicule = incident.vehicule;
          const chauffeur = incident.chauffeur;
          const incData = {
            serverId: incident._id,
            vehicleId: typeof vehicule === 'object' ? vehicule?._id ?? '' : vehicule ?? incident.vehicleId ?? '',
            driverId: typeof chauffeur === 'object' ? chauffeur?._id ?? '' : chauffeur ?? incident.driverId ?? '',
            date: new Date(incident.date),
            type: incident.type,
            severity: incident.severity,
            description: incident.description,
            synced: 1,
          };

          if (existingInc && existingInc.id) {
            await this.offlineService.incidents.update(existingInc.id, incData);
          } else {
            await this.offlineService.incidents.add(incData);
          }
        }

        const localIncidents = await this.offlineService.incidents
          .where('vehicleId')
          .equals(selectedVehicleId)
          .toArray();

        for (const localInc of localIncidents) {
          if (localInc.serverId && !backendIncidentIds.has(localInc.serverId)) {
            if (localInc.id) {
              await this.offlineService.incidents.delete(localInc.id);
            }
          }
        }
      } catch (error) {
        console.warn('Incidents endpoint might not exist:', error);
      }
    } catch (error) {
      console.error('Error pulling server changes:', error);
    }
  }

  async syncReferenceData() {
    try {
      const lieux = await firstValueFrom(
        this.http.get<ServerLieu[]>(`${environment.apiUrl}/lieux`),
      );
      await this.offlineService.lieux.clear();
      await this.offlineService.lieux.bulkPut(lieux);

      const users = await firstValueFrom(
        this.http.get<ServerUser[]>(`${environment.apiUrl}/utilisateurs`),
      );
      await this.offlineService.users.clear();
      await this.offlineService.users.bulkPut(users);
    } catch (error) {
      console.error('Error syncing reference data:', error);
    }
  }

  private async markAsSynced(items: Array<{ id?: number }>, table: { update: (id: number, data: Record<string, number>) => Promise<number> }) {
    for (const item of items) {
      if (item.id) {
        await table.update(item.id, { synced: 1 });
      }
    }
  }
}
