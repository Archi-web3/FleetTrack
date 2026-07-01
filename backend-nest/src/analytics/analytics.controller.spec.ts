import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import type { AuthRequest } from './analytics.controller';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: jest.Mocked<Partial<AnalyticsService>>;

  beforeEach(async () => {
    analyticsService = {
      getGlobalStats: jest.fn().mockResolvedValue({ total: 100 }),
      getStatsByProject: jest
        .fn()
        .mockResolvedValue([{ projet: 'P1', count: 10 }]),
      calculateTCO: jest.fn().mockResolvedValue({ tco: 5000 }),
      predictCosts: jest.fn().mockResolvedValue({ predicted: 6000 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGlobalStats', () => {
    it('should return global stats', async () => {
      const mockReq = { user: { pays: 'France' } } as unknown as AuthRequest;
      const query = { dateDebut: '2023-01-01', dateFin: '2023-12-31' };

      const result = await controller.getGlobalStats(query, mockReq);

      expect(analyticsService.getGlobalStats).toHaveBeenCalledWith({
        dateDebut: '2023-01-01',
        dateFin: '2023-12-31',
        projet: undefined,
        vehicule: undefined,
        countryId: 'France',
      });
      expect(result).toEqual({ total: 100 });
    });
  });

  describe('getStatsByProject', () => {
    it('should return stats by project', async () => {
      const mockReq = { user: { pays: 'France' } } as unknown as AuthRequest;
      const query = { projet: 'P1' };

      const result = await controller.getStatsByProject(query, mockReq);

      expect(analyticsService.getStatsByProject).toHaveBeenCalledWith({
        dateDebut: undefined,
        dateFin: undefined,
        projet: 'P1',
        vehicule: undefined,
        countryId: 'France',
      });
      expect(result).toEqual([{ projet: 'P1', count: 10 }]);
    });
  });

  describe('getTCO', () => {
    it('should calculate TCO', async () => {
      const mockReq = { user: { pays: 'France' } } as unknown as AuthRequest;
      const query = { vehicleId: 'V1' };

      const result = await controller.getTCO(query, mockReq);

      expect(analyticsService.calculateTCO).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        vehicleId: 'V1',
        country: 'France',
      });
      expect(result).toEqual({ tco: 5000 });
    });
  });

  describe('getCostForecast', () => {
    it('should predict costs', async () => {
      const mockReq = { user: { pays: 'France' } } as unknown as AuthRequest;

      const result = await controller.getCostForecast(6, mockReq);

      expect(analyticsService.predictCosts).toHaveBeenCalledWith('France', 6);
      expect(result).toEqual({ predicted: 6000 });
    });
  });
});
