export class SyncVehicleDto {
  serverId?: string;
  immatriculation?: string;
  kilometrageInitial?: number;
  kilometrage?: number;
  consommation?: { valeur?: number };
}

export class SyncTripDto {
  plannedMovementId?: string;
  vehicleId!: string;
  driverId!: string;
  passengerIds?: string[];
  departurePlaceId?: string;
  arrivalPlaceId?: string;
  startDateTime!: Date;
  endDateTime!: Date;
  startMileage!: number;
  endMileage!: number;
  purpose?: string;
  photos?: string[];
  gpsTrace?: any[];
}

export class SyncFuelDto {
  vehicleId!: string;
  driverId!: string;
  date!: Date;
  quantity!: number;
  mileage!: number;
  type?: string;
  source?: string;
  isFull?: boolean;
  price?: number;
  photos?: string[];
}

export class SyncMaintenanceDto {
  vehicleId!: string;
  date!: Date;
  type!: string;
  mileage!: number;
  garage?: string;
  cost?: number;
}

export class SyncIncidentDto {
  vehicleId!: string;
  driverId!: string;
  date!: Date;
  type!: string;
  severity?: string;
  description?: string;
  location?: string;
  photos?: string[];
  cost?: number;
}

export class SyncPayloadDto {
  vehicles?: SyncVehicleDto[];
  trips?: SyncTripDto[];
  fuels?: SyncFuelDto[];
  maintenances?: SyncMaintenanceDto[];
  incidents?: SyncIncidentDto[];
}
