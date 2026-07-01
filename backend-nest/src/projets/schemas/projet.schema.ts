import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProjetDocument = Projet & Document;

@Schema({ timestamps: true })
export class Projet {
  @Prop({ required: true, unique: true, trim: true })
  nom: string;

  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop({ default: true })
  actif: boolean;
}

export const ProjetSchema = SchemaFactory.createForClass(Projet);
