import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistTemplatesController } from './checklist-templates.controller';

describe('ChecklistTemplatesController', () => {
  let controller: ChecklistTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistTemplatesController],
    }).compile();

    controller = module.get<ChecklistTemplatesController>(
      ChecklistTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
