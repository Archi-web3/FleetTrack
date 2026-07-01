import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChauffeurDocument = Chauffeur & Document;

@Schema()
export class Chauffeur {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true, unique: true })
  telephone: string;

  @Prop({ required: true, unique: true })
  permis: string;

  @Prop({ default: true })
  disponible: boolean;

  @Prop([
    {
      status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'Sick', 'Vacation', 'Other'],
        required: true,
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      notes: String,
    },
  ])
  schedules: any[];
}

export const ChauffeurSchema = SchemaFactory.createForClass(Chauffeur);
