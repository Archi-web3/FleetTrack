import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type IncidentDocument = Incident & Document;

@Schema({ timestamps: true })
export class Incident {
  @Prop({ default: Date.now, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Vehicule' })
  vehicule: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  chauffeur: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Mouvement' })
  mouvement: Types.ObjectId;

  @Prop({
    enum: ['Panne', 'Accident', 'Retard', 'Sécurité', 'Autre'],
    required: true,
  })
  type: string;

  @Prop({
    enum: ['Faible', 'Moyenne', 'Haute', 'Critique'],
    default: 'Moyenne',
  })
  severity: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object })
  location: {
    lat?: number;
    lng?: number;
    address?: string;
  };

  @Prop([{ type: MongooseSchema.Types.Mixed }])
  photos: any[];

  @Prop({
    enum: ['Signalé', 'En cours de traitement', 'Résolu', 'Clôturé'],
    default: 'Signalé',
  })
  status: string;

  @Prop()
  resolutionNotes: string;

  @Prop()
  cost: number;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
