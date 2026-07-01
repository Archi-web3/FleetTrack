import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type FuelDocument = Fuel & Document;

@Schema({ timestamps: true })
export class Fuel {
  @Prop({ default: Date.now, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Vehicule', required: true })
  vehicule: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  chauffeur: Types.ObjectId;

  @Prop({ required: true })
  mileage: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({
    enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'],
    required: true,
  })
  fuelType: string;

  @Prop({
    enum: ['Station Service', 'Stock ACF', 'Autre'],
    default: 'Station Service',
  })
  source: string;

  @Prop({ default: true })
  fullTank: boolean;

  @Prop()
  price: number;

  @Prop()
  driverSignature: string;

  @Prop([{ type: MongooseSchema.Types.Mixed }])
  photos: any[];

  @Prop()
  comments: string;

  @Prop()
  calculatedConsumption: number;

  @Prop({ default: false })
  isOverConsumption: boolean;

  @Prop()
  theoreticalConsumptionSnapshot: number;
}

export const FuelSchema = SchemaFactory.createForClass(Fuel);
