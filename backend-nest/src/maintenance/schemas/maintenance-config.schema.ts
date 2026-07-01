import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaintenanceConfigDocument = MaintenanceConfig & Document;

@Schema({ timestamps: true })
export class MaintenanceConfig {
  @Prop({ required: true })
  typeVehicule: string;

  @Prop({
    required: true,
    enum: [
      '100% piste difficile',
      'Mixte route + piste',
      'Route goudronnée',
      'Route mixte/urbaine',
    ],
  })
  conditionsRoute: string;

  @Prop({ required: true, min: 0 })
  intervalleService: number;

  @Prop({ default: true })
  actif: boolean;

  @Prop({ enum: ['Predefined', 'Custom'], default: 'Predefined' })
  sequenceMode: string;

  @Prop({ type: [String], default: ['A', 'B', 'A', 'C'] })
  customSequence: string[];

  @Prop()
  remarques: string;
}

export const MaintenanceConfigSchema =
  SchemaFactory.createForClass(MaintenanceConfig);
