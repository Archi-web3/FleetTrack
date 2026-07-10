import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AxesController } from './axes.controller';
import { AxesService } from './axes.service';
import { Axe, AxeSchema } from './schemas/axe.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Axe.name, schema: AxeSchema }]),
    AuditLogsModule,
  ],
  controllers: [AxesController],
  providers: [AxesService],
  exports: [AxesService],
})
export class AxesModule {}
