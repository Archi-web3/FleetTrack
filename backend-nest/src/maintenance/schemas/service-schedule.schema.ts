import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServiceScheduleDocument = ServiceSchedule & Document;

@Schema()
export class ServiceTask {
  @Prop()
  description: string;

  @Prop()
  numeroTacheManuel: string;

  @Prop({ default: false })
  validee: boolean;

  @Prop()
  dateValidation: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  validePar: Types.ObjectId;

  @Prop()
  commentaire: string;
}

const ServiceTaskSchema = SchemaFactory.createForClass(ServiceTask);

@Schema({ timestamps: true })
export class ServiceSchedule {
  @Prop({ type: Types.ObjectId, ref: 'Vehicule', required: true })
  vehicule: Types.ObjectId;

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

  @Prop({ type: [ServiceTaskSchema] })
  taches: ServiceTask[];

  @Prop({ type: Object })
  signature: {
    superviseur: Types.ObjectId;
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
ServiceScheduleSchema.index({ vehicule: 1, statut: 1 });
ServiceScheduleSchema.index({ kilometragePrevu: 1 });
