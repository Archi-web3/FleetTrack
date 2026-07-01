import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Stop {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lieu' })
  lieu: string;

  @Prop()
  dateArrivee: Date;

  @Prop()
  dateDepart: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Mouvement' })
  originMouvement: string;
}

const StopSchema = SchemaFactory.createForClass(Stop);

@Schema()
export class Mouvement {
  @Prop({
    type: [StopSchema],
    validate: {
      validator: function (this: Mouvement, v: any[]) {
        if (this.type === 'maintenance') return true;
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Un mouvement standard doit avoir au moins une étape.',
    },
  })
  stops: Stop[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
  })
  demandeur: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicule' })
  vehicule: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Utilisateur' })
  chauffeur: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Utilisateur' }])
  passagers: string[];

  @Prop([String])
  materiel: string[];

  @Prop()
  objectif: string;

  @Prop({
    enum: [
      'en attente',
      'validé',
      'pris en charge',
      'en cours',
      'terminé',
      'annulé',
      'refusé',
      'en attente validation sécurité',
      'regroupé',
      'regroupé-enfant',
    ],
    default: 'en attente',
  })
  statut: string;

  @Prop({
    enum: ['en attente', 'validé', 'refusé', 'non requis'],
    default: 'en attente',
  })
  statutLogistique: string;

  @Prop({
    enum: ['en attente', 'validé', 'refusé', 'non requis'],
    default: 'non requis',
  })
  statutSecurite: string;

  @Prop()
  motifRefus: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Mouvement' })
  parentMouvement: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Mouvement' }])
  enfantsMouvements: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Base' })
  base: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop()
  projet: string;

  @Prop([String])
  projetsPassagers: string[];

  @Prop({ enum: ['Routier', 'Aérien', 'Maritime'], default: 'Routier' })
  modeTransport: string;

  @Prop({ enum: ['mission', 'maintenance'], default: 'mission' })
  type: string;

  @Prop({ enum: ['Check Hebdo', 'Service', 'Réparation', 'Autre'] })
  maintenanceType: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  validationLevelRequired: number;

  @Prop([
    {
      validatedBy: { type: MongooseSchema.Types.ObjectId, ref: 'Utilisateur' },
      validatedAt: { type: Date, default: Date.now },
      level: Number,
      status: String,
    },
  ])
  validationHistory: any[];

  @Prop([
    {
      validator: { type: MongooseSchema.Types.ObjectId, ref: 'Utilisateur' },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      approvedAt: Date,
      comment: String,
      isBackup: { type: Boolean, default: false },
    },
  ])
  securityApprovals: any[];

  @Prop({ default: false })
  securityConsensusReached: boolean;

  @Prop({ enum: ['matrix', 'fallback'], default: 'matrix' })
  securityValidationMode: string;

  @Prop([
    {
      projet: String,
      percentage: Number,
    },
  ])
  projetsVentilation: any[];

  @Prop({ default: false })
  isRoundTrip: boolean;

  @Prop({ default: false })
  isAdHoc: boolean;

  @Prop()
  dateDepart: Date;

  @Prop()
  dateArrivee: Date;

  @Prop()
  takenInChargeAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Chauffeur' })
  takenInChargeBy: string;

  // E-LOGBOOK
  @Prop()
  realDepartureTime: Date;

  @Prop()
  realArrivalTime: Date;

  @Prop()
  startMileage: number;

  @Prop()
  endMileage: number;

  @Prop([
    {
      lat: Number,
      lng: Number,
      timestamp: Date,
      speed: Number,
    },
  ])
  gpsTrace: any[];

  @Prop([
    {
      type: { type: String, enum: ['time', 'distance', 'route'] },
      value: Number,
      description: String,
    },
  ])
  deviations: any[];

  @Prop()
  driverObservations: string;

  @Prop([{ type: MongooseSchema.Types.Mixed }])
  photos: any[];

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ enum: ['pending', 'synced', 'error'], default: 'pending' })
  syncStatus: string;
}

export const MouvementSchema = SchemaFactory.createForClass(Mouvement);

MouvementSchema.pre(
  'save',
  function (next: import('mongoose').CallbackWithoutResultAndOptionalError) {
    if (this.stops && this.stops.length > 0) {
      this.dateDepart = this.stops[0].dateDepart;
      this.dateArrivee = this.stops[this.stops.length - 1].dateArrivee;
    }
    next();
  },
);

export type MouvementDocument = HydratedDocument<Mouvement>;
