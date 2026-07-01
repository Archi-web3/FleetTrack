import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BasesService } from './bases.service';
import { BasesController } from './bases.controller';
import { Base, BaseSchema } from './schemas/base.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Base.name, schema: BaseSchema }]),
  ],
  controllers: [BasesController],
  providers: [BasesService],
  exports: [BasesService, MongooseModule], // Export MongooseModule for BaseModel access in other modules
})
export class BasesModule {}
