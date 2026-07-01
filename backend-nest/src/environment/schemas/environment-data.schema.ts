import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnvironmentDataDocument = EnvironmentData & Document;

@Schema({ timestamps: true })
export class EnvironmentData {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true, min: 1, max: 12 })
  month: number;

  @Prop({ required: true })
  base: string;

  @Prop({ default: 0 })
  fleet_km_total: number;

  @Prop({ default: 0 })
  fleet_liters_total: number;

  @Prop({ default: 0 })
  fleet_liters_ac: number;

  @Prop({ default: 0 })
  fleet_liters_loc: number;

  @Prop({ default: 0 })
  fleet_usage_admin_percent: number;

  @Prop({ default: 0 })
  energy_gen_hours: number;

  @Prop({ default: 0 })
  energy_gen_liters: number;

  @Prop({ default: 0 })
  energy_grid_kwh: number;

  @Prop({ default: 0 })
  driver_nb_projects: number;

  @Prop({ default: 0 })
  driver_nb_sites: number;

  @Prop({ default: 0 })
  driver_staff_fte: number;

  @Prop({ default: 0 })
  driver_financial_volume: number;

  @Prop({ default: 0 })
  driver_km_passengers: number;

  @Prop({ default: 0 })
  driver_km_cargo: number;

  @Prop({ default: 0 })
  driver_tonnage: number;

  @Prop({ default: 0 })
  metrics_iap_score: number;

  @Prop({ default: 0 })
  metrics_co2_total: number;

  @Prop({ default: 0 })
  metrics_co2_per_iap: number;

  @Prop({ default: 0 })
  metrics_fleet_l100: number;

  @Prop({ default: 0 })
  metrics_gen_lh: number;
}

export const EnvironmentDataSchema =
  SchemaFactory.createForClass(EnvironmentData);
EnvironmentDataSchema.index({ year: 1, month: 1, base: 1 }, { unique: true });
