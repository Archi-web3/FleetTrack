"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPayloadDto = exports.SyncIncidentDto = exports.SyncMaintenanceDto = exports.SyncFuelDto = exports.SyncTripDto = exports.SyncVehicleDto = void 0;
class SyncVehicleDto {
    serverId;
    immatriculation;
    kilometrageInitial;
    kilometrage;
    consommation;
}
exports.SyncVehicleDto = SyncVehicleDto;
class SyncTripDto {
    plannedMovementId;
    vehicleId;
    driverId;
    passengerIds;
    departurePlaceId;
    arrivalPlaceId;
    startDateTime;
    endDateTime;
    startMileage;
    endMileage;
    purpose;
    photos;
    gpsTrace;
}
exports.SyncTripDto = SyncTripDto;
class SyncFuelDto {
    vehicleId;
    driverId;
    date;
    quantity;
    mileage;
    type;
    source;
    isFull;
    price;
    photos;
}
exports.SyncFuelDto = SyncFuelDto;
class SyncMaintenanceDto {
    vehicleId;
    date;
    type;
    mileage;
    garage;
    cost;
}
exports.SyncMaintenanceDto = SyncMaintenanceDto;
class SyncIncidentDto {
    vehicleId;
    driverId;
    date;
    type;
    severity;
    description;
    location;
    photos;
    cost;
}
exports.SyncIncidentDto = SyncIncidentDto;
class SyncPayloadDto {
    vehicles;
    trips;
    fuels;
    maintenances;
    incidents;
}
exports.SyncPayloadDto = SyncPayloadDto;
//# sourceMappingURL=sync-payload.dto.js.map