export class CreateVehicleDto {
  immatriculation!: string;
  marque!: string;
  modele!: string;
  annee?: number;
  kilometrageInitial?: number;
  kilometrage?: number;
  typeVehicule?: string;
  typePropriete?: string;
  purchaseValue?: number;
  depreciationMonths?: number;
  insuranceCost?: number;
  rentalCost?: number;
  capacitePassagers?: number;
  [key: string]: any;
}

export class UpdateVehicleDto {
  immatriculation?: string;
  marque?: string;
  modele?: string;
  annee?: number;
  kilometrageInitial?: number;
  kilometrage?: number;
  typeVehicule?: string;
  typePropriete?: string;
  purchaseValue?: number;
  depreciationMonths?: number;
  insuranceCost?: number;
  rentalCost?: number;
  capacitePassagers?: number;
  [key: string]: any;
}
