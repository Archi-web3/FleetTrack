import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerateursService } from './generateurs.service';
import { GenerateursController } from './generateurs.controller';
import { Generateur, GenerateurSchema } from './schemas/generateur.schema';
import { LogbookModule } from '../logbook/logbook.module';
import {
  GenerateurLogbook,
  GenerateurLogbookSchema,
} from '../logbook/schemas/logbook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Generateur.name, schema: GenerateurSchema },
      { name: GenerateurLogbook.name, schema: GenerateurLogbookSchema },
    ]),
    LogbookModule, // If we want to interact with Logbook explicitly
  ],
  controllers: [GenerateursController],
  providers: [GenerateursService],
  exports: [GenerateursService],
})
export class GenerateursModule {}
