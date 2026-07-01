import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WaiversController } from './waivers.controller';
import { WaiversService } from './waivers.service';
import { Waiver, WaiverSchema } from './schemas/waiver.schema';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Waiver.name, schema: WaiverSchema }]),
    UploadsModule,
  ],
  controllers: [WaiversController],
  providers: [WaiversService],
  exports: [WaiversService],
})
export class WaiversModule {}
