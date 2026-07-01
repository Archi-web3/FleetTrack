import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Vehicule {
  @Prop({ required: true, unique: true })
  immatriculation: string;

  @Prop({ required: true })
  marque: string;

  @Prop({ required: true })
  modele: string;

  @Prop()
  acfCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Base' })
  base: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop({ enum: ['ACF', 'Location'], default: 'ACF' })
  typePropriete: string;

  @Prop({ type: Object })
  locationDetails: {
    nomLoueur?: string;
    dateDebut?: Date;
    dateFin?: Date;
  };

  @Prop({ type: Object })
  achatDetails: {
    dateAchat?: Date;
    valeurAchat?: number;
  };

  @Prop({ enum: ['Voiture', 'Camion', 'Moto'], default: 'Voiture' })
  category: string;

  @Prop()
  type: string;

  @Prop({ enum: ['Kilometers', 'Miles'], default: 'Kilometers' })
  distanceUnit: string;

  @Prop()
  resourcesCode: string;

  @Prop()
  nickname: string;

  @Prop({ default: false })
  permanentlyAssigned: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Chauffeur' })
  assignedDriverId: string;

  @Prop({ enum: ['Support only', 'Activity only', 'Mixed'] })
  usageType: string;

  @Prop()
  bcfSpoNumber: string;

  @Prop()
  technicalInspectionDueDate: Date;

  @Prop({ default: 0 })
  unloggedKilometers: number;

  @Prop()
  year: number;

  @Prop()
  startDate: Date;

  @Prop({ required: true, default: 0, min: 0 })
  kilometrage: number;

  @Prop({ default: 0, min: 0 })
  kilometrageInitial: number;

  @Prop({ default: Date.now })
  derniereMiseAJourKm: Date;

  @Prop({ default: 5 })
  capacitePassagers: number;

  @Prop({ default: true })
  enService: boolean;

  @Prop({ default: false })
  enableGpsTracking: boolean;

  @Prop({
    enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'],
    default: 'Diesel',
  })
  fuelType: string;

  @Prop({
    enum: ['En Service', 'Hors Service', 'Vendu', 'Archivé', 'Restitué'],
    default: 'En Service',
  })
  statut: string;

  @Prop()
  archivedAt: Date;

  @Prop({ type: Object })
  emissionsCO2: {
    valeur?: number;
    source?: string;
  };

  @Prop({ type: Object })
  consommation: {
    valeur?: number;
    source?: string;
    dateTest?: Date;
  };

  @Prop()
  purchaseValue: number;

  @Prop()
  depreciationMonths: number;

  @Prop()
  insuranceCost: number;

  @Prop()
  insuranceEndDate: Date;

  @Prop()
  rentalCost: number;

  @Prop({ default: false })
  driverIncluded: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  pushSubscription: any;

  @Prop({ type: Object })
  assurance: {
    isAvailable?: boolean;
    contractNumber?: string;
    nomAssureur?: string;
    dateFin?: Date;
    certificatUrl?: string;
  };

  @Prop([
    {
      code: Number,
      name: String,
      isPresent: { type: Boolean, default: false },
      lastChecked: Date,
      comment: String,
    },
  ])
  equipements: any[];

  @Prop()
  remarks: string;
}

export const VehiculeSchema = SchemaFactory.createForClass(Vehicule);

export type VehiculeDocument = import('mongoose').HydratedDocument<Vehicule>;

// Porting the pre-save hook for ACF Code generation
VehiculeSchema.pre(
  'save',
  async function (
    next: import('mongoose').CallbackWithoutResultAndOptionalError,
  ) {
    if (!this.acfCode) {
      try {
        const Denomination = 'MOB';
        // this.constructor refers to the model
        const model = this
          .constructor as import('mongoose').Model<VehiculeDocument>;
        const lastVehicule = await model
          .findOne({
            pays: this.pays,
            acfCode: { $regex: new RegExp(`^${Denomination}-\\d+$`) },
          })
          .sort({ acfCode: -1 })
          .limit(1);

        let nextNum = 1;
        if (lastVehicule && lastVehicule.acfCode) {
          const parts = lastVehicule.acfCode.split('-');
          if (parts.length === 2) {
            const numPart = parseInt(parts[1], 10);
            if (!isNaN(numPart)) {
              nextNum = numPart + 1;
            }
          }
        }

        this.acfCode = `${Denomination}-${nextNum.toString().padStart(3, '0')}`;
      } catch (err) {
        return next(err as Error);
      }
    }
    next();
  },
);
