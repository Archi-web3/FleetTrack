import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistTemplatesService } from './checklist-templates.service';

describe('ChecklistTemplatesService', () => {
  let service: ChecklistTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChecklistTemplatesService],
    }).compile();

    service = module.get<ChecklistTemplatesService>(ChecklistTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
