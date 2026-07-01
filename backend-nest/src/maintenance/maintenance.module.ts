import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceAutomationService } from './maintenance-automation.service';
import {
  MaintenanceConfig,
  MaintenanceConfigSchema,
} from './schemas/maintenance-config.schema';
import {
  ChecklistTemplate,
  ChecklistTemplateSchema,
} from './schemas/checklist-template.schema';
import {
  ServiceSchedule,
  ServiceScheduleSchema,
} from './schemas/service-schedule.schema';
import {
  WeeklyChecklist,
  WeeklyChecklistSchema,
} from './schemas/weekly-checklist.schema';
import { Maintenance, MaintenanceSchema } from './schemas/maintenance.schema';
import { Vehicule, VehiculeSchema } from '../vehicles/schemas/vehicule.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MaintenanceConfig.name, schema: MaintenanceConfigSchema },
      { name: ChecklistTemplate.name, schema: ChecklistTemplateSchema },
      { name: ServiceSchedule.name, schema: ServiceScheduleSchema },
      { name: WeeklyChecklist.name, schema: WeeklyChecklistSchema },
      { name: Maintenance.name, schema: MaintenanceSchema },
      { name: Vehicule.name, schema: VehiculeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceAutomationService],
  exports: [MaintenanceService, MaintenanceAutomationService],
})
export class MaintenanceModule {}
