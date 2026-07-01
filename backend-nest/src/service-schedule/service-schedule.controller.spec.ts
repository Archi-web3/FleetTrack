import { Test, TestingModule } from '@nestjs/testing';
import { ServiceScheduleController } from './service-schedule.controller';

describe('ServiceScheduleController', () => {
  let controller: ServiceScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceScheduleController],
    }).compile();

    controller = module.get<ServiceScheduleController>(
      ServiceScheduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
