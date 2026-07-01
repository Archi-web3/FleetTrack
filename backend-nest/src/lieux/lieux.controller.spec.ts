import { Test, TestingModule } from '@nestjs/testing';
import { LieuxController } from './lieux.controller';
import { LieuxService } from './lieux.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('LieuxController', () => {
  let controller: LieuxController;
  let lieuxService: jest.Mocked<Partial<LieuxService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    lieuxService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nom: 'Lieu Test' }]),
      findById: jest.fn().mockResolvedValue({ id: '1', nom: 'Lieu Test' }),
      create: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Lieu Test', pays: 'France' }),
      update: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Lieu Test Updated' }),
      delete: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Lieu Test Deleted' }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LieuxController],
      providers: [
        { provide: LieuxService, useValue: lieuxService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    controller = module.get<LieuxController>(LieuxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of lieux', async () => {
      const mockReq = { user: { profil: 'Admin' } } as AuthRequest;
      const result = await controller.findAll(mockReq);

      expect(lieuxService.findAll).toHaveBeenCalledWith(mockReq.user);
      expect(result).toEqual([{ id: '1', nom: 'Lieu Test' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single lieu', async () => {
      const result = await controller.findOne('1');
      expect(lieuxService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', nom: 'Lieu Test' });
    });
  });

  describe('create', () => {
    it('should create a lieu and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = { nom: 'Lieu Test', pays: 'France', type: 'Bureau' };

      const result = await controller.create(dto, mockReq);

      expect(lieuxService.create).toHaveBeenCalledWith(dto, mockReq.user);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'CREATE_LOCATION',
        'ADMIN',
        'Location: Lieu Test',
        { country: 'France' },
      );
      expect(result).toEqual({ id: '1', nom: 'Lieu Test', pays: 'France' });
    });
  });

  describe('update', () => {
    it('should update a lieu and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = { nom: 'Lieu Test Updated' };

      const result = await controller.update('1', dto, mockReq);

      expect(lieuxService.update).toHaveBeenCalledWith('1', dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'UPDATE_LOCATION',
        'ADMIN',
        'Location: Lieu Test Updated',
        { changes: dto },
      );
      expect(result).toEqual({ id: '1', nom: 'Lieu Test Updated' });
    });
  });

  describe('delete', () => {
    it('should delete a lieu and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;

      const result = await controller.delete('1', mockReq);

      expect(lieuxService.delete).toHaveBeenCalledWith('1');
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'DELETE_LOCATION',
        'ADMIN',
        'Location: Lieu Test Deleted',
      );
      expect(result).toEqual({ message: 'Lieu supprimé' });
    });
  });
});
