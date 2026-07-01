import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaysService } from './pays.service';
import { PaysController } from './pays.controller';
import { Pays, PaysSchema } from './schemas/pays.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pays.name, schema: PaysSchema }]),
  ],
  controllers: [PaysController],
  providers: [PaysService],
  exports: [PaysService],
})
export class PaysModule {}
