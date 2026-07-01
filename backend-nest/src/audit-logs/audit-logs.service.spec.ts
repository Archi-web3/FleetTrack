/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './schemas/audit-log.schema';

describe('AuditLogsService', () => {
  let service: AuditLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: jest.fn().mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({ _id: '1' }),
          })),
        },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logAction', () => {
    it('should log an action without throwing', async () => {
      const mockReq = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test' },
      } as unknown as import('../analytics/analytics.controller').AuthRequest;
      await expect(
        service.logAction(mockReq, 'TEST_ACTION', 'TEST', 'Test target'),
      ).resolves.not.toThrow();
    });
  });
});
