import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentController } from './environment.controller';
import { EnvironmentService } from './environment.service';
import {
  EnvironmentAction,
  EnvironmentActionSchema,
} from './schemas/environment-action.schema';
import {
  EnvironmentData,
  EnvironmentDataSchema,
} from './schemas/environment-data.schema';
import { Fuel, FuelSchema } from '../logbook/schemas/fuel.schema';
import {
  Mouvement,
  MouvementSchema,
} from '../mouvements/schemas/mouvement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnvironmentAction.name, schema: EnvironmentActionSchema },
      { name: EnvironmentData.name, schema: EnvironmentDataSchema },
      { name: Fuel.name, schema: FuelSchema },
      { name: Mouvement.name, schema: MouvementSchema },
    ]),
  ],
  controllers: [EnvironmentController],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
