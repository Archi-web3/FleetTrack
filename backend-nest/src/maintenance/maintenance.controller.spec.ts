import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('MaintenanceController', () => {
  let controller: MaintenanceController;
  let maintenanceService: jest.Mocked<Partial<MaintenanceService>>;

  beforeEach(async () => {
    maintenanceService = {
      getStats: jest.fn().mockResolvedValue({ total: 10 }),
      getCurrentWeeklyChecklist: jest
        .fn()
        .mockResolvedValue({ id: 'chk1', vehiculeId: '1' }),
      validateWeeklyTask: jest
        .fn()
        .mockResolvedValue({ id: 'chk1', validated: true }),
      getNextService: jest.fn().mockResolvedValue({ id: 'srv1', type: 'A' }),
      completeService: jest
        .fn()
        .mockResolvedValue({ id: 'srv1', status: 'Completed' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [
        { provide: MaintenanceService, useValue: maintenanceService },
      ],
    }).compile();

    controller = module.get<MaintenanceController>(MaintenanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return stats', async () => {
      const result = await controller.getStats();
      expect(maintenanceService.getStats).toHaveBeenCalled();
      expect(result).toEqual({ total: 10 });
    });
  });

  describe('getCurrentWeeklyChecklist', () => {
    it('should return current weekly checklist', async () => {
      const mockReq = { user: { id: 'user1' } } as AuthRequest;
      const result = await controller.getCurrentWeeklyChecklist('1', mockReq);

      expect(maintenanceService.getCurrentWeeklyChecklist).toHaveBeenCalledWith(
        '1',
        'user1',
      );
      expect(result).toEqual({ id: 'chk1', vehiculeId: '1' });
    });
  });

  describe('validateWeeklyTask', () => {
    it('should validate weekly task', async () => {
      const dto = {
        checklistId: 'chk1',
        tacheId: 't1',
        validee: true,
        commentaire: 'ok',
      };
      const result = await controller.validateWeeklyTask(dto);

      expect(maintenanceService.validateWeeklyTask).toHaveBeenCalledWith(
        'chk1',
        't1',
        true,
        'ok',
      );
      expect(result).toEqual({ id: 'chk1', validated: true });
    });
  });

  describe('getNextService', () => {
    it('should return next service', async () => {
      const result = await controller.getNextService('1');
      expect(maintenanceService.getNextService).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: 'srv1', type: 'A' });
    });
  });

  describe('completeService', () => {
    it('should complete a service', async () => {
      const mockReq = { user: { id: 'user1' } } as AuthRequest;
      const dto = { serviceId: 'srv1', signature: 'sig1' };

      const result = await controller.completeService(dto, mockReq);

      expect(maintenanceService.completeService).toHaveBeenCalledWith(
        'srv1',
        'sig1',
        'user1',
      );
      expect(result).toEqual({ id: 'srv1', status: 'Completed' });
    });
  });
});
