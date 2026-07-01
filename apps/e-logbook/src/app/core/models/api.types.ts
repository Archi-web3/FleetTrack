/** Shared API response types for e-logbook */

export interface SyncResultItem {
  _id: string;
}

export interface SyncResultSet {
  items?: SyncResultItem[];
}

export interface SyncResponse {
  results?: {
    trips?: SyncResultSet;
    fuels?: SyncResultSet;
    maintenances?: SyncResultSet;
    incidents?: SyncResultSet;
  };
}

export interface ServerTrip {
  _id: string;
  vehicule?: { _id: string } | string;
  chauffeur?: { _id: string } | string;
  passagers?: Array<{ _id: string } | string>;
  stops?: Array<{
    lieu?: { _id: string } | string;
    dateDepart: string;
    dateArrivee?: string;
  }>;
  startMileage?: number;
  endMileage?: number;
  objectif?: string;
  purpose?: string;
  gpsTrace?: unknown;
}

export interface ServerFuel {
  _id: string;
  vehicule?: { _id: string } | string;
  chauffeur?: { _id: string } | string;
  vehicleId?: string;
  driverId?: string;
  date: string;
  quantity: number;
  mileage: number;
  fuelType?: string;
  type?: string;
  source: string;
  fullTank?: boolean;
}

export interface ServerMaintenance {
  _id: string;
  vehicule?: { _id: string } | string;
  vehicleId?: string;
  date: string;
  type: string;
  mileage: number;
  garage?: string;
  cost?: number;
}

export interface ServerIncident {
  _id: string;
  vehicule?: { _id: string } | string;
  chauffeur?: { _id: string } | string;
  vehicleId?: string;
  driverId?: string;
  date: string;
  type: string;
  severity: string;
  description: string;
}

export interface ServerVehicle {
  _id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  type: string;
  [key: string]: unknown;
}

export interface ServerLieu {
  _id: string;
  nom: string;
  adresse: string;
}

export interface ServerUser {
  _id: string;
  nom: string;
  email: string;
}

export interface HttpErrorResponse {
  status: number;
  message?: string;
}

// ============================================================
// Domain models used across feature components
// ============================================================

export interface VehicleRef {
  _id: string;
  immatriculation?: string;
  marque?: string;
  modele?: string;
  type?: string;
  acfCode?: string;
  fuelType?: string;
  enService?: boolean;
  enableGpsTracking?: boolean;
  [key: string]: unknown;
}

export interface UserRef {
  _id: string;
  nom?: string;
  prenom?: string;
  email?: string;
  profil?: string;
  pays?: string;
  base?: string;
  token?: string;
  [key: string]: unknown;
}

export interface LieuRef {
  _id: string;
  nom: string;
  adresse?: string;
}

export interface FuelRecord {
  _id: string;
  vehicule?: VehicleRef | string;
  chauffeur?: UserRef | string;
  date: string | Date;
  quantity: number;
  mileage: number;
  fuelType?: string;
  source?: string;
  fullTank?: boolean;
  cost?: number;
  photos?: string[];
}

export interface MaintenanceRecord {
  _id: string;
  vehicule?: VehicleRef | string;
  date: string | Date;
  type: string;
  mileage: number;
  garage?: string;
  cost?: number;
  photos?: string[];
}

export interface IncidentRecord {
  _id: string;
  vehicule?: VehicleRef | string;
  chauffeur?: UserRef | string;
  date: string | Date;
  type: string;
  severity: 'Faible' | 'Modéré' | 'Grave' | string;
  description: string;
  location?: { lat: number; lng: number; address?: string };
  cost?: number;
  photos?: string[];
}

export interface Movement {
  _id: string;
  vehicule?: VehicleRef | string;
  chauffeur?: UserRef | string;
  passagers?: Array<UserRef | string>;
  stops?: Array<{
    lieu?: LieuRef | string;
    dateDepart: string | Date;
    dateArrivee?: string | Date;
  }>;
  startMileage?: number;
  endMileage?: number;
  objectif?: string;
  purpose?: string;
  statut?: string;
  gpsTrace?: unknown;
}

export interface BrandSettings {
  name?: string;
  logo?: string;
  primaryColor?: string;
  appName?: string;
  mobileAppName?: string;
  mobileAppTagline?: string;
  mobileAppLogo?: string;
  mobileLoginLogo?: string;
  mobileLoginLogoColor?: string;
  mobileHeaderLogo?: string;
  mobileHeaderLogoColor?: string;
  [key: string]: unknown;
}

