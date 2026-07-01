import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema()
export class AuditLog {
  @Prop({ type: Object })
  actor: {
    userId: string;
    nom: string;
    role: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  target: string;

  @Prop({ type: Object })
  details: any;

  @Prop()
  ip: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
