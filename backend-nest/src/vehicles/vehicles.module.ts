import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicule, VehiculeSchema } from './schemas/vehicule.schema';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicule.name, schema: VehiculeSchema },
    ]),
    forwardRef(() => MaintenanceModule),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService, MongooseModule], // Export MongooseModule for the MaintenanceAutomationService
})
export class VehiclesModule {}
