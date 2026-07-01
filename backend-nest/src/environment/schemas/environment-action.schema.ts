import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnvironmentActionDocument = EnvironmentAction & Document;

@Schema({ timestamps: true })
export class EnvironmentAction {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  base: string;

  @Prop({ required: true, enum: ['T1', 'T2', 'T3', 'T4'] })
  quarter: string;

  @Prop({
    required: true,
    enum: [
      'Pooling',
      'Planification',
      'Choix Véhicule',
      'Eco-conduite',
      'Maintenance',
      'Substitution',
      'Géolocalisation',
      'Stock Carburant',
      'Générateurs',
      'Politique Transport',
      'Autre',
    ],
  })
  category: string;

  @Prop({ required: true })
  action: string;

  @Prop({
    enum: ['Non commencé', 'En cours', 'Fait', 'Reporté'],
    default: 'Non commencé',
  })
  status: string;

  @Prop()
  impact_estimated: string;

  @Prop()
  comments: string;
}

export const EnvironmentActionSchema =
  SchemaFactory.createForClass(EnvironmentAction);
