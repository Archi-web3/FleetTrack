/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fuel, FuelDocument } from './schemas/fuel.schema';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import {
  Mouvement,
  MouvementDocument,
} from '../mouvements/schemas/mouvement.schema';
import {
  Vehicule,
  VehiculeDocument,
} from '../vehicles/schemas/vehicule.schema';
import {
  Maintenance,
  MaintenanceDocument,
} from '../maintenance/schemas/maintenance.schema';
import { Lieu, LieuDocument } from '../lieux/schemas/lieu.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { calculateGpsDistance, analyzeDeviations } from '../utils/gps.util';
import { VehiclesService } from '../vehicles/vehicles.service';
import { SyncPayloadDto } from './dto/sync-payload.dto';

@Injectable()
export class LogbookSyncService {
  private readonly logger = new Logger(LogbookSyncService.name);

  constructor(
    @InjectModel(Fuel.name) private fuelModel: Model<FuelDocument>,
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    @InjectModel(Mouvement.name)
    private mouvementModel: Model<MouvementDocument>,
    @InjectModel(Vehicule.name) private vehiculeModel: Model<VehiculeDocument>,
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<MaintenanceDocument>,
    @InjectModel(Lieu.name) private lieuModel: Model<LieuDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private vehiclesService: VehiclesService,
  ) {}

  async sync(payload: SyncPayloadDto): Promise<Record<string, any>> {
    this.logger.log('--- SYNC REQUEST RECEIVED ---');
    const { trips, fuels, maintenances, incidents, vehicles } = payload;

    const results = {
      trips: { success: 0, failed: 0, errors: [] as any[], items: [] as any[] },
      fuels: { success: 0, failed: 0, errors: [] as any[], items: [] as any[] },
      maintenances: {
        success: 0,
        failed: 0,
        errors: [] as any[],
        items: [] as any[],
      },
      incidents: {
        success: 0,
        failed: 0,
        errors: [] as any[],
        items: [] as any[],
      },
      vehicles: {
        success: 0,
        failed: 0,
        errors: [] as any[],
        items: [] as any[],
      },
    };

    // 0. Sync Vehicles
    if (vehicles && Array.isArray(vehicles)) {
      for (const vehicleData of vehicles) {
        try {
          let existingVehicle:
            | import('../vehicles/schemas/vehicule.schema').VehiculeDocument
            | null = null;
          if (vehicleData.serverId) {
            existingVehicle = await this.vehiculeModel.findById(
              vehicleData.serverId,
            );
          } else if (vehicleData.immatriculation) {
            existingVehicle = await this.vehiculeModel.findOne({
              immatriculation: vehicleData.immatriculation,
            });
          }

          if (existingVehicle) {
            Object.assign(existingVehicle, vehicleData);
            if (vehicleData.serverId)
              existingVehicle._id =
                vehicleData.serverId as unknown as import('mongoose').Types.ObjectId;
            await existingVehicle.save();
            results.vehicles.success++;
            results.vehicles.items.push({
              _id: existingVehicle._id,
              status: 'updated',
            });
          } else {
            const newVehicle = new this.vehiculeModel(vehicleData);
            const savedVehicle = await newVehicle.save();
            results.vehicles.success++;
            results.vehicles.items.push({
              _id: savedVehicle._id,
              status: 'created',
            });
          }
        } catch (e: any) {
          const err = e as Error;
          this.logger.error('Error syncing vehicle:', err.message);
          results.vehicles.failed++;
          results.vehicles.items.push({ error: err.message });
        }
      }
    }

    // 1. Sync Trips
    if (trips && Array.isArray(trips)) {
      let defaultLieu = await this.lieuModel.findOne();
      if (!defaultLieu) {
        defaultLieu = await new this.lieuModel({
          nom: 'Inconnu',
          adresse: 'Inconnu',
        }).save();
      }

      for (const tripData of trips) {
        try {
          if (tripData.plannedMovementId) {
            const plannedMvt = await this.mouvementModel.findById(
              tripData.plannedMovementId,
            );
            if (plannedMvt) {
              plannedMvt.statut = 'terminé';
              plannedMvt.realDepartureTime = tripData.startDateTime;
              plannedMvt.realArrivalTime = tripData.endDateTime;
              plannedMvt.startMileage = tripData.startMileage;
              plannedMvt.endMileage = tripData.endMileage;
              plannedMvt.driverObservations = tripData.purpose;
              plannedMvt.isLocked = true;

              if (tripData.gpsTrace && tripData.gpsTrace.length > 0) {
                plannedMvt.gpsTrace = tripData.gpsTrace;
                const gpsDistance = calculateGpsDistance(tripData.gpsTrace);
                const odometerDistance =
                  tripData.endMileage - tripData.startMileage;
                const deviations = analyzeDeviations(
                  gpsDistance,
                  odometerDistance,
                );
                if (deviations.length > 0) {
                  plannedMvt.deviations = deviations;
                }
              }

              await plannedMvt.save();
              await this.recalculateVehicleMileage(
                plannedMvt.vehicule.toString(),
              );

              results.trips.success++;
              results.trips.items.push({
                _id: plannedMvt._id,
                status: 'updated',
              });
              continue;
            }
          }

          const existingTrip = await this.mouvementModel.findOne({
            vehicule: tripData.vehicleId,
            startMileage: tripData.startMileage,
            endMileage: tripData.endMileage,
          });

          if (existingTrip) {
            results.trips.success++;
            results.trips.items.push({
              _id: existingTrip._id,
              status: 'exists',
            });
            continue;
          }

          const lieuDepartId = tripData.departurePlaceId || defaultLieu._id;
          const lieuArriveeId = tripData.arrivalPlaceId || defaultLieu._id;

          let driverBase: import('mongoose').Types.ObjectId | string | null =
            null;
          let driverCountry: import('mongoose').Types.ObjectId | string | null =
            null;
          const driver = await this.userModel
            .findById(tripData.driverId)
            .populate('base pays');
          if (driver) {
            driverBase = driver.base ? driver.base : null;
            driverCountry = driver.pays ? driver.pays : null;
          }

          const newMouvement = new this.mouvementModel({
            vehicule: tripData.vehicleId,
            chauffeur: tripData.driverId,
            demandeur: tripData.driverId,
            passagers: tripData.passengerIds || [],
            base: driverBase,
            pays: driverCountry,
            isAdHoc: true,
            stops: [
              { lieu: lieuDepartId, dateDepart: tripData.startDateTime },
              { lieu: lieuArriveeId, dateArrivee: tripData.endDateTime },
            ],
            datePrevue: tripData.startDateTime,
            heureDepart: tripData.startDateTime,
            heureArrivee: tripData.endDateTime,
            lieuDepart: 'Non spécifié',
            lieuArrivee: 'Non spécifié',
            motif: tripData.purpose,
            objectif: tripData.purpose,
            statut: 'terminé',
            realDepartureTime: tripData.startDateTime,
            realArrivalTime: tripData.endDateTime,
            startMileage: tripData.startMileage,
            endMileage: tripData.endMileage,
            driverObservations: tripData.purpose,
            photos: tripData.photos || [],
            isLocked: true,
            gpsTrace: tripData.gpsTrace || [],
          });

          if (tripData.gpsTrace && tripData.gpsTrace.length > 0) {
            const gpsDistance = calculateGpsDistance(tripData.gpsTrace);
            const odometerDistance =
              tripData.endMileage - tripData.startMileage;
            const deviations = analyzeDeviations(gpsDistance, odometerDistance);
            if (deviations.length > 0) {
              newMouvement.deviations = deviations;
            }
          }

          await newMouvement.save();
          await this.recalculateVehicleMileage(tripData.vehicleId);

          results.trips.success++;
          results.trips.items.push({
            _id: newMouvement._id,
            status: 'created',
          });
        } catch (e: any) {
          const err = e as Error;
          this.logger.error('Error syncing trip:', err.message);
          results.trips.failed++;
          results.trips.items.push({ status: 'error', error: err.message });
        }
      }
    }

    // 2. Sync Fuels
    if (fuels && Array.isArray(fuels)) {
      for (const fuelData of fuels) {
        try {
          const existingFuel = await this.fuelModel.findOne({
            vehicule: fuelData.vehicleId,
            date: fuelData.date,
            mileage: fuelData.mileage,
          });

          if (existingFuel) {
            results.fuels.success++;
            results.fuels.items.push({
              _id: existingFuel._id,
              status: 'exists',
            });
            continue;
          }

          const newFuelData: Record<string, any> = {
            vehicule: fuelData.vehicleId,
            chauffeur: fuelData.driverId,
            date: fuelData.date,
            quantity: fuelData.quantity,
            mileage: fuelData.mileage,
            fuelType: fuelData.type || 'Diesel',
            source: fuelData.source,
            fullTank: fuelData.isFull !== undefined ? fuelData.isFull : true,
            price: fuelData.price,
            photos: fuelData.photos || [],
          };

          try {
            const fetchedVeh = await this.vehiculeModel.findById(
              fuelData.vehicleId,
            );
            let theoreticalConsumption = 0;
            if (
              fetchedVeh &&
              fetchedVeh.consommation &&
              fetchedVeh.consommation.valeur
            ) {
              theoreticalConsumption = fetchedVeh.consommation.valeur;
              newFuelData.theoreticalConsumptionSnapshot =
                theoreticalConsumption;
            }

            const previousFuel = await this.fuelModel
              .findOne({
                vehicule: fuelData.vehicleId,
                date: { $lt: fuelData.date },
              })
              .sort({ date: -1 });

            if (previousFuel && previousFuel.mileage < fuelData.mileage) {
              const distance = fuelData.mileage - previousFuel.mileage;
              if (distance > 0) {
                const calculated = (fuelData.quantity / distance) * 100;
                newFuelData.calculatedConsumption = parseFloat(
                  calculated.toFixed(2),
                );

                if (newFuelData.fullTank && theoreticalConsumption > 0) {
                  if (calculated > theoreticalConsumption * 1.1) {
                    newFuelData.isOverConsumption = true;
                  }
                }
              }
            }
          } catch (alertErr) {
            this.logger.error('Error calculating consumption alert:', alertErr);
          }

          const newFuel = new this.fuelModel(newFuelData);
          await newFuel.save();
          results.fuels.success++;
          results.fuels.items.push({ _id: newFuel._id, status: 'created' });
        } catch (e: any) {
          const err = e as Error;
          results.fuels.failed++;
          results.fuels.items.push({ status: 'error', error: err.message });
        }
      }
    }

    // 3. Sync Maintenances
    if (maintenances && Array.isArray(maintenances)) {
      for (const maintData of maintenances) {
        try {
          const existingMaint = await this.maintenanceModel.findOne({
            vehicule: maintData.vehicleId,
            date: maintData.date,
            mileage: maintData.mileage,
          });

          if (existingMaint) {
            results.maintenances.success++;
            results.maintenances.items.push({
              _id: existingMaint._id,
              status: 'exists',
            });
            continue;
          }

          const newMaint = new this.maintenanceModel({
            vehicule: maintData.vehicleId,
            date: maintData.date,
            type: maintData.type,
            mileage: maintData.mileage,
            garage: maintData.garage,
            cost: maintData.cost,
          });
          await newMaint.save();
          results.maintenances.success++;
          results.maintenances.items.push({
            _id: newMaint._id,
            status: 'created',
          });
        } catch (e: any) {
          const err = e as Error;
          results.maintenances.failed++;
          results.maintenances.items.push({
            status: 'error',
            error: err.message,
          });
        }
      }
    }

    // 4. Sync Incidents
    if (incidents && Array.isArray(incidents)) {
      for (const incData of incidents) {
        try {
          const existingInc = await this.incidentModel.findOne({
            vehicule: incData.vehicleId,
            date: incData.date,
            type: incData.type,
          });

          if (existingInc) {
            results.incidents.success++;
            results.incidents.items.push({
              _id: existingInc._id,
              status: 'exists',
            });
            continue;
          }

          const newInc = new this.incidentModel({
            vehicule: incData.vehicleId,
            chauffeur: incData.driverId,
            date: incData.date,
            type: incData.type,
            severity: incData.severity,
            description: incData.description,
            location: incData.location,
            photos: incData.photos || [],
            cost: incData.cost,
          });
          await newInc.save();
          results.incidents.success++;
          results.incidents.items.push({ _id: newInc._id, status: 'created' });
        } catch (e: any) {
          const err = e as Error;
          results.incidents.failed++;
          results.incidents.items.push({ status: 'error', error: err.message });
        }
      }
    }

    return { message: 'Synchronisation terminée', results };
  }

  async recalculateVehicleMileage(vehicleId: string): Promise<void> {
    try {
      const vehicle = await this.vehiculeModel.findById(vehicleId);
      if (!vehicle) return;

      const [lastTrip, lastFuel, lastMaint] = await Promise.all([
        this.mouvementModel
          .findOne({ vehicule: vehicleId })
          .sort({ endMileage: -1 })
          .select('endMileage'),
        this.fuelModel
          .findOne({ vehicule: vehicleId })
          .sort({ mileage: -1 })
          .select('mileage'),
        this.maintenanceModel
          .findOne({ vehicule: vehicleId })
          .sort({ mileage: -1 })
          .select('mileage'),
      ]);

      let maxMileage = vehicle.kilometrageInitial || 0;
      if (lastTrip && lastTrip.endMileage > maxMileage)
        maxMileage = lastTrip.endMileage;
      if (lastFuel && lastFuel.mileage > maxMileage)
        maxMileage = lastFuel.mileage;
      if (lastMaint && lastMaint.mileage > maxMileage)
        maxMileage = lastMaint.mileage;

      if (maxMileage > vehicle.kilometrage) {
        await this.vehiclesService.update(vehicleId, {
          kilometrage: maxMileage,
        });
        this.logger.log(
          `Recalculated mileage for vehicle ${vehicleId}: ${maxMileage}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `Failed to recalculate mileage for ${vehicleId}: ${(err as Error).message}`,
      );
    }
  }
}
