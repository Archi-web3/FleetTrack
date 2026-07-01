import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WaiverDocument = Waiver & Document;

@Schema({ timestamps: true })
export class Waiver {
  @Prop({ required: true })
  visitorName: string;

  @Prop({ required: true })
  signatureUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Vehicule', required: true })
  vehicleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Mouvement' })
  tripId: Types.ObjectId;

  @Prop({ default: Date.now })
  signedAt: Date;

  @Prop({ default: 'v1.0' })
  legalTextVersion: string;
}

export const WaiverSchema = SchemaFactory.createForClass(Waiver);
