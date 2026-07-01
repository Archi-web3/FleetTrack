/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { LogbookSyncService } from './logbook-sync.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('LogbookController', () => {
  let controller: LogbookController;
  let logbookService: jest.Mocked<Partial<LogbookService>>;
  let logbookSyncService: jest.Mocked<Partial<LogbookSyncService>>;

  beforeEach(async () => {
    logbookService = {
      getMyTrips: jest.fn().mockResolvedValue([{ id: 'trip1' }]),
      takeCharge: jest.fn().mockResolvedValue({ id: 'trip1', status: 'Taken' }),
    };

    logbookSyncService = {
      sync: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogbookController],
      providers: [
        { provide: LogbookService, useValue: logbookService },
        { provide: LogbookSyncService, useValue: logbookSyncService },
      ],
    }).compile();

    controller = module.get<LogbookController>(LogbookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyTrips', () => {
    it('should return trips for user', async () => {
      const mockReq = { user: { id: 'u1' } } as AuthRequest;
      const result = await controller.getMyTrips(mockReq);
      expect(logbookService.getMyTrips).toHaveBeenCalledWith('u1');
      expect(result).toEqual([{ id: 'trip1' }]);
    });
  });

  describe('takeCharge', () => {
    it('should take charge of a trip', async () => {
      const mockReq = { user: { id: 'u1' } } as AuthRequest;
      const result = await controller.takeCharge('trip1', mockReq);
      expect(logbookService.takeCharge).toHaveBeenCalledWith('trip1', 'u1');
      expect(result).toEqual({ id: 'trip1', status: 'Taken' });
    });
  });

  describe('syncData', () => {
    it('should sync data', async () => {
      const payload = { test: true } as any;
      const result = await controller.syncData(payload);
      expect(logbookSyncService.sync).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ success: true });
    });
  });
});
