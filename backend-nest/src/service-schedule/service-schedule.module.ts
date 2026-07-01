import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceScheduleService } from './service-schedule.service';
import { ServiceScheduleController } from './service-schedule.controller';
import {
  ServiceSchedule,
  ServiceScheduleSchema,
} from './schemas/service-schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceSchedule.name, schema: ServiceScheduleSchema },
    ]),
  ],
  controllers: [ServiceScheduleController],
  providers: [ServiceScheduleService],
  exports: [ServiceScheduleService],
})
export class ServiceScheduleModule {}
