import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LieuDocument = Lieu & Document;

@Schema()
export class Lieu {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  adresse: string;

  @Prop({
    type: Object,
    required: true,
  })
  coordonnees: {
    latitude: number;
    longitude: number;
  };

  @Prop({ default: false })
  estSensible: boolean;

  @Prop({ enum: [1, 2, 3, 4, 5], default: 1 })
  niveauSecurite: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Base' })
  base: string;
}

export const LieuSchema = SchemaFactory.createForClass(Lieu);
