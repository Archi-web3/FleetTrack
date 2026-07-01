import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Vehicule, VehiculeSchema } from '../vehicles/schemas/vehicule.schema';
import { Fuel, FuelSchema } from '../logbook/schemas/fuel.schema';
import {
  Maintenance,
  MaintenanceSchema,
} from '../maintenance/schemas/maintenance.schema';
import { Incident, IncidentSchema } from '../logbook/schemas/incident.schema';
import {
  Mouvement,
  MouvementSchema,
} from '../mouvements/schemas/mouvement.schema';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicule.name, schema: VehiculeSchema },
      { name: Fuel.name, schema: FuelSchema },
      { name: Maintenance.name, schema: MaintenanceSchema },
      { name: Incident.name, schema: IncidentSchema },
      { name: Mouvement.name, schema: MouvementSchema },
    ]),
    SettingsModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
