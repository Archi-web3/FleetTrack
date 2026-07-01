import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema()
export class AlertReadBy {
  @Prop()
  vehicleId: string;

  @Prop({ default: Date.now })
  readAt: Date;

  @Prop()
  user: string;
}

const AlertReadBySchema = SchemaFactory.createForClass(AlertReadBy);

@Schema()
export class AlertDeletedBy {
  @Prop()
  vehicleId: string;

  @Prop({ default: Date.now })
  deletedAt: Date;
}

const AlertDeletedBySchema = SchemaFactory.createForClass(AlertDeletedBy);

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['info', 'warning', 'danger'], default: 'info' })
  severity: string;

  @Prop({ enum: ['all', 'vehicle'], required: true })
  targetType: string;

  @Prop({ default: null })
  targetVehicleId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: [AlertReadBySchema] })
  readBy: AlertReadBy[];

  @Prop({ type: [AlertDeletedBySchema] })
  deletedBy: AlertDeletedBy[];

  @Prop({ default: Date.now, expires: '7d' })
  createdAt: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
