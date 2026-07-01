"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LogbookSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogbookSyncService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fuel_schema_1 = require("./schemas/fuel.schema");
const incident_schema_1 = require("./schemas/incident.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
const maintenance_schema_1 = require("../maintenance/schemas/maintenance.schema");
const lieu_schema_1 = require("../lieux/schemas/lieu.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const gps_util_1 = require("../utils/gps.util");
const vehicles_service_1 = require("../vehicles/vehicles.service");
let LogbookSyncService = LogbookSyncService_1 = class LogbookSyncService {
    fuelModel;
    incidentModel;
    mouvementModel;
    vehiculeModel;
    maintenanceModel;
    lieuModel;
    userModel;
    vehiclesService;
    logger = new common_1.Logger(LogbookSyncService_1.name);
    constructor(fuelModel, incidentModel, mouvementModel, vehiculeModel, maintenanceModel, lieuModel, userModel, vehiclesService) {
        this.fuelModel = fuelModel;
        this.incidentModel = incidentModel;
        this.mouvementModel = mouvementModel;
        this.vehiculeModel = vehiculeModel;
        this.maintenanceModel = maintenanceModel;
        this.lieuModel = lieuModel;
        this.userModel = userModel;
        this.vehiclesService = vehiclesService;
    }
    async sync(payload) {
        this.logger.log('--- SYNC REQUEST RECEIVED ---');
        const { trips, fuels, maintenances, incidents, vehicles } = payload;
        const results = {
            trips: { success: 0, failed: 0, errors: [], items: [] },
            fuels: { success: 0, failed: 0, errors: [], items: [] },
            maintenances: {
                success: 0,
                failed: 0,
                errors: [],
                items: [],
            },
            incidents: {
                success: 0,
                failed: 0,
                errors: [],
                items: [],
            },
            vehicles: {
                success: 0,
                failed: 0,
                errors: [],
                items: [],
            },
        };
        if (vehicles && Array.isArray(vehicles)) {
            for (const vehicleData of vehicles) {
                try {
                    let existingVehicle = null;
                    if (vehicleData.serverId) {
                        existingVehicle = await this.vehiculeModel.findById(vehicleData.serverId);
                    }
                    else if (vehicleData.immatriculation) {
                        existingVehicle = await this.vehiculeModel.findOne({
                            immatriculation: vehicleData.immatriculation,
                        });
                    }
                    if (existingVehicle) {
                        Object.assign(existingVehicle, vehicleData);
                        if (vehicleData.serverId)
                            existingVehicle._id = vehicleData.serverId;
                        await existingVehicle.save();
                        results.vehicles.success++;
                        results.vehicles.items.push({
                            _id: existingVehicle._id,
                            status: 'updated',
                        });
                    }
                    else {
                        const newVehicle = new this.vehiculeModel(vehicleData);
                        const savedVehicle = await newVehicle.save();
                        results.vehicles.success++;
                        results.vehicles.items.push({
                            _id: savedVehicle._id,
                            status: 'created',
                        });
                    }
                }
                catch (e) {
                    const err = e;
                    this.logger.error('Error syncing vehicle:', err.message);
                    results.vehicles.failed++;
                    results.vehicles.items.push({ error: err.message });
                }
            }
        }
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
                        const plannedMvt = await this.mouvementModel.findById(tripData.plannedMovementId);
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
                                const gpsDistance = (0, gps_util_1.calculateGpsDistance)(tripData.gpsTrace);
                                const odometerDistance = tripData.endMileage - tripData.startMileage;
                                const deviations = (0, gps_util_1.analyzeDeviations)(gpsDistance, odometerDistance);
                                if (deviations.length > 0) {
                                    plannedMvt.deviations = deviations;
                                }
                            }
                            await plannedMvt.save();
                            await this.recalculateVehicleMileage(plannedMvt.vehicule.toString());
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
                    let driverBase = null;
                    let driverCountry = null;
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
                        const gpsDistance = (0, gps_util_1.calculateGpsDistance)(tripData.gpsTrace);
                        const odometerDistance = tripData.endMileage - tripData.startMileage;
                        const deviations = (0, gps_util_1.analyzeDeviations)(gpsDistance, odometerDistance);
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
                }
                catch (e) {
                    const err = e;
                    this.logger.error('Error syncing trip:', err.message);
                    results.trips.failed++;
                    results.trips.items.push({ status: 'error', error: err.message });
                }
            }
        }
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
                    const newFuelData = {
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
                        const fetchedVeh = await this.vehiculeModel.findById(fuelData.vehicleId);
                        let theoreticalConsumption = 0;
                        if (fetchedVeh &&
                            fetchedVeh.consommation &&
                            fetchedVeh.consommation.valeur) {
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
                                newFuelData.calculatedConsumption = parseFloat(calculated.toFixed(2));
                                if (newFuelData.fullTank && theoreticalConsumption > 0) {
                                    if (calculated > theoreticalConsumption * 1.1) {
                                        newFuelData.isOverConsumption = true;
                                    }
                                }
                            }
                        }
                    }
                    catch (alertErr) {
                        this.logger.error('Error calculating consumption alert:', alertErr);
                    }
                    const newFuel = new this.fuelModel(newFuelData);
                    await newFuel.save();
                    results.fuels.success++;
                    results.fuels.items.push({ _id: newFuel._id, status: 'created' });
                }
                catch (e) {
                    const err = e;
                    results.fuels.failed++;
                    results.fuels.items.push({ status: 'error', error: err.message });
                }
            }
        }
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
                }
                catch (e) {
                    const err = e;
                    results.maintenances.failed++;
                    results.maintenances.items.push({
                        status: 'error',
                        error: err.message,
                    });
                }
            }
        }
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
                }
                catch (e) {
                    const err = e;
                    results.incidents.failed++;
                    results.incidents.items.push({ status: 'error', error: err.message });
                }
            }
        }
        return { message: 'Synchronisation terminée', results };
    }
    async recalculateVehicleMileage(vehicleId) {
        try {
            const vehicle = await this.vehiculeModel.findById(vehicleId);
            if (!vehicle)
                return;
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
                this.logger.log(`Recalculated mileage for vehicle ${vehicleId}: ${maxMileage}`);
            }
        }
        catch (err) {
            this.logger.error(`Failed to recalculate mileage for ${vehicleId}: ${err.message}`);
        }
    }
};
exports.LogbookSyncService = LogbookSyncService;
exports.LogbookSyncService = LogbookSyncService = LogbookSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fuel_schema_1.Fuel.name)),
    __param(1, (0, mongoose_1.InjectModel)(incident_schema_1.Incident.name)),
    __param(2, (0, mongoose_1.InjectModel)(mouvement_schema_1.Mouvement.name)),
    __param(3, (0, mongoose_1.InjectModel)(vehicule_schema_1.Vehicule.name)),
    __param(4, (0, mongoose_1.InjectModel)(maintenance_schema_1.Maintenance.name)),
    __param(5, (0, mongoose_1.InjectModel)(lieu_schema_1.Lieu.name)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        vehicles_service_1.VehiclesService])
], LogbookSyncService);
//# sourceMappingURL=logbook-sync.service.js.map