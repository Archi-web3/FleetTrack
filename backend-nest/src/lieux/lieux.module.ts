import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LieuxService } from './lieux.service';
import { LieuxController } from './lieux.controller';
import { Lieu, LieuSchema } from './schemas/lieu.schema';
import { BasesModule } from '../bases/bases.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lieu.name, schema: LieuSchema }]),
    BasesModule, // Nécessaire pour injecter le BaseModel dans LieuxService
  ],
  controllers: [LieuxController],
  providers: [LieuxService],
  exports: [LieuxService],
})
export class LieuxModule {}
