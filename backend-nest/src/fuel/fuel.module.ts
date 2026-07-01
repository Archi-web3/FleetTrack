import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { Fuel, FuelSchema } from './schemas/fuel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fuel.name, schema: FuelSchema }]),
  ],
  controllers: [FuelController],
  providers: [FuelService],
  exports: [FuelService],
})
export class FuelModule {}
