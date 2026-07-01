import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ServiceScheduleDocument = ServiceSchedule & Document;

@Schema({ timestamps: true })
export class ServiceSchedule {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Vehicule',
    required: true,
  })
  vehicule: string;

  @Prop({ required: true })
  typeService: string;

  @Prop({ required: true, min: 0 })
  kilometragePrevu: number;

  @Prop({ default: 0, min: 0 })
  kilometrageActuel: number;

  @Prop({
    enum: ['À venir', 'Dû', 'En retard', 'Complété'],
    default: 'À venir',
  })
  statut: string;

  @Prop()
  dateAlerte: Date;

  @Prop([
    {
      description: String,
      numeroTacheManuel: String,
      validee: { type: Boolean, default: false },
      dateValidation: Date,
      validePar: { type: MongooseSchema.Types.ObjectId, ref: 'Utilisateur' },
      commentaire: String,
    },
  ])
  taches: any[];

  @Prop({ type: Object })
  signature: {
    superviseur: string;
    date: Date;
    signatureData: string;
  };

  @Prop({ default: Date.now })
  dateCreation: Date;

  @Prop()
  dateCompletion: Date;

  @Prop({ type: Object })
  prochainService: {
    type: string;
    kilometrage: number;
  };
}

export const ServiceScheduleSchema =
  SchemaFactory.createForClass(ServiceSchedule);
