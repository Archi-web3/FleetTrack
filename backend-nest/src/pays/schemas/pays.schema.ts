import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaysDocument = Pays & Document;

@Schema({ timestamps: true })
export class Pays {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ default: 'USD' })
  devise: string;

  @Prop({ type: Object, default: { fuseauHoraire: 'UTC' } })
  parametres: {
    fuseauHoraire: string;
  };
}

export const PaysSchema = SchemaFactory.createForClass(Pays);
