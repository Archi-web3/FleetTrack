import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjetsService } from './projets.service';
import { ProjetsController } from './projets.controller';
import { Projet, ProjetSchema } from './schemas/projet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Projet.name, schema: ProjetSchema }]),
  ],
  controllers: [ProjetsController],
  providers: [ProjetsService],
  exports: [ProjetsService],
})
export class ProjetsModule {}
