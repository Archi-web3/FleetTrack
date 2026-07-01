import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BaseDocument = Base & Document;

@Schema({ timestamps: true })
export class Base {
  @Prop({ required: true })
  nom: string;

  @Prop()
  code: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays', required: true })
  pays: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Utilisateur' })
  chef_de_base: string;

  @Prop({ type: Object })
  localisation: {
    lat: number;
    lng: number;
  };
}

export const BaseSchema = SchemaFactory.createForClass(Base);
