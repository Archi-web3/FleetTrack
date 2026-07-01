import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MaintenanceDocument = Maintenance & Document;

@Schema({ timestamps: true })
export class Maintenance {
  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Vehicule',
    required: true,
  })
  vehicule: string;

  @Prop({
    enum: ['Preventive', 'Curative', 'Contrôle Technique', 'Autre'],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  mileage: number;

  @Prop()
  garage: string;

  @Prop()
  mechanic: string;

  @Prop([
    {
      name: String,
      status: {
        type: String,
        enum: ['OK', 'Not OK', 'Fixed', 'Pending'],
        default: 'OK',
      },
      comments: String,
    },
  ])
  tasks: any[];

  @Prop([
    {
      name: String,
      quantity: Number,
      reference: String,
      price: Number,
    },
  ])
  parts: any[];

  @Prop()
  cost: number;

  @Prop()
  invoicePhoto: string;

  @Prop()
  mechanicSignature: string;

  @Prop()
  nextMaintenanceMileage: number;

  @Prop()
  comments: string;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
