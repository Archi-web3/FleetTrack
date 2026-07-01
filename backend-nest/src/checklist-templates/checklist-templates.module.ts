import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecklistTemplatesService } from './checklist-templates.service';
import { ChecklistTemplatesController } from './checklist-templates.controller';
import {
  ChecklistTemplate,
  ChecklistTemplateSchema,
} from './schemas/checklist-template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChecklistTemplate.name, schema: ChecklistTemplateSchema },
    ]),
  ],
  controllers: [ChecklistTemplatesController],
  providers: [ChecklistTemplatesService],
  exports: [ChecklistTemplatesService],
})
export class ChecklistTemplatesModule {}
