import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookService } from './logbook.service';
import { LogbookSyncService } from './logbook-sync.service';
import { LogbookController } from './logbook.controller';
import { Fuel, FuelSchema } from './schemas/fuel.schema';
import { Incident, IncidentSchema } from './schemas/incident.schema';
import {
  Mouvement,
  MouvementSchema,
} from '../mouvements/schemas/mouvement.schema';
import { Vehicule, VehiculeSchema } from '../vehicles/schemas/vehicule.schema';
import { Lieu, LieuSchema } from '../lieux/schemas/lieu.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  GenerateurLogbook,
  GenerateurLogbookSchema,
} from './schemas/logbook.schema';
import {
  Maintenance,
  MaintenanceSchema,
} from '../maintenance/schemas/maintenance.schema';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Fuel.name, schema: FuelSchema },
      { name: Incident.name, schema: IncidentSchema },
      { name: Mouvement.name, schema: MouvementSchema },
      { name: Vehicule.name, schema: VehiculeSchema },
      { name: Lieu.name, schema: LieuSchema },
      { name: User.name, schema: UserSchema },
      { name: GenerateurLogbook.name, schema: GenerateurLogbookSchema },
      { name: Maintenance.name, schema: MaintenanceSchema },
    ]),
    forwardRef(() => VehiclesModule),
  ],
  controllers: [LogbookController],
  providers: [LogbookService, LogbookSyncService],
  exports: [LogbookService, LogbookSyncService],
})
export class LogbookModule {}
