import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SecurityConfigDocument = SecurityConfig & Document;

@Schema()
export class SecurityRule {
  @Prop({ required: true, min: 1, max: 5 })
  level: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  mandatoryValidators: Types.ObjectId[];

  @Prop({ default: true })
  requireUnanimity: boolean;

  @Prop({ default: 1 })
  quorum: number;

  @Prop({ default: false })
  includeLowerLevels: boolean;
}
export const SecurityRuleSchema = SchemaFactory.createForClass(SecurityRule);

@Schema({ timestamps: true })
export class SecurityConfig {
  @Prop({ type: Types.ObjectId, ref: 'Pays', required: true })
  pays: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Base' })
  base: Types.ObjectId;

  @Prop({ type: [SecurityRuleSchema] })
  rules: SecurityRule[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const SecurityConfigSchema =
  SchemaFactory.createForClass(SecurityConfig);
SecurityConfigSchema.index({ pays: 1, base: 1 }, { unique: true });
