import { Test, TestingModule } from '@nestjs/testing';
import { BasesController } from './bases.controller';
import { BasesService } from './bases.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('BasesController', () => {
  let controller: BasesController;
  let basesService: jest.Mocked<Partial<BasesService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    basesService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nom: 'Base Test' }]),
      create: jest.fn().mockResolvedValue({ id: '1', nom: 'Base Test' }),
      update: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Base Test Updated' }),
      delete: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Base Test Deleted' }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasesController],
      providers: [
        { provide: BasesService, useValue: basesService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    controller = module.get<BasesController>(BasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of bases and apply country filter for Admin', async () => {
      const mockReq = {
        user: { profil: 'Admin', pays: 'France' },
      } as AuthRequest;
      const result = await controller.findAll(mockReq, '');

      expect(basesService.findAll).toHaveBeenCalledWith({ pays: 'France' });
      expect(result).toEqual([{ id: '1', nom: 'Base Test' }]);
    });

    it('should return a list of bases and use query pays if not Admin', async () => {
      const mockReq = { user: { profil: 'User' } } as AuthRequest;
      const result = await controller.findAll(mockReq, 'Italie');

      expect(basesService.findAll).toHaveBeenCalledWith({ pays: 'Italie' });
      expect(result).toEqual([{ id: '1', nom: 'Base Test' }]);
    });
  });

  describe('create', () => {
    it('should create a base and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = { nom: 'Base Test', pays: 'France' };

      const result = await controller.create(dto, mockReq);

      expect(basesService.create).toHaveBeenCalledWith(dto, mockReq.user);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'CREATE_BASE',
        'ADMIN',
        'Base: Base Test',
      );
      expect(result).toEqual({ id: '1', nom: 'Base Test' });
    });
  });

  describe('update', () => {
    it('should update a base and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = { nom: 'Base Test Updated' };

      const result = await controller.update('1', dto, mockReq);

      expect(basesService.update).toHaveBeenCalledWith('1', dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'UPDATE_BASE',
        'ADMIN',
        'Base: Base Test Updated',
      );
      expect(result).toEqual({ id: '1', nom: 'Base Test Updated' });
    });
  });

  describe('delete', () => {
    it('should delete a base and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;

      const result = await controller.delete('1', mockReq);

      expect(basesService.delete).toHaveBeenCalledWith('1');
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'DELETE_BASE',
        'ADMIN',
        'Base: Base Test Deleted',
      );
      expect(result).toEqual({ message: 'Base supprimée avec succès' });
    });
  });
});
