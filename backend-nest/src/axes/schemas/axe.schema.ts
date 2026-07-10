import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AxeDocument = Axe & Document;

@Schema({ timestamps: true })
export class Axe {
  @Prop({ required: true })
  nom: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lieu', required: true })
  depart: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lieu', required: true })
  arrivee: string;

  @Prop({ enum: [1, 2, 3, 4, 5], default: 1 })
  niveauSecurite: number;

  @Prop()
  commentaire: string;

  @Prop({ default: true })
  actif: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays', required: true })
  pays: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Base', required: false })
  base: string;
}

export const AxeSchema = SchemaFactory.createForClass(Axe);
