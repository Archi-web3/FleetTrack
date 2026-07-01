import { Test, TestingModule } from '@nestjs/testing';
import { ProjetsController } from './projets.controller';
import { ProjetsService } from './projets.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('ProjetsController', () => {
  let controller: ProjetsController;
  let projetsService: jest.Mocked<Partial<ProjetsService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    projetsService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nom: 'Projet Test' }]),
      findById: jest.fn().mockResolvedValue({ id: '1', nom: 'Projet Test' }),
      create: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Projet Test', code: 'PRJ1' }),
      update: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Projet Test Updated' }),
      delete: jest.fn().mockResolvedValue({
        id: '1',
        nom: 'Projet Test Deleted',
        code: 'PRJ1',
      }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetsController],
      providers: [
        { provide: ProjetsService, useValue: projetsService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    controller = module.get<ProjetsController>(ProjetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of actifs projets and apply country filter for Admin', async () => {
      const mockReq = {
        user: { profil: 'Admin', pays: 'France' },
      } as AuthRequest;
      const result = await controller.findAll(mockReq, 'false');

      expect(projetsService.findAll).toHaveBeenCalledWith({
        actif: true,
        pays: 'France',
      });
      expect(result).toEqual([{ id: '1', nom: 'Projet Test' }]);
    });

    it('should include inactifs if requested and not filter country if not Admin', async () => {
      const mockReq = { user: { profil: 'User' } } as AuthRequest;
      const result = await controller.findAll(mockReq, 'true');

      expect(projetsService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([{ id: '1', nom: 'Projet Test' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single projet', async () => {
      const result = await controller.findOne('1');
      expect(projetsService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', nom: 'Projet Test' });
    });
  });

  describe('create', () => {
    it('should create a projet and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = {
        nom: 'Projet Test',
        code: 'PRJ1',
        bailleur: 'Bailleur1',
        dates: '2020-2021',
        budget: 1000,
        description: 'Desc',
      };

      const result = await controller.create(dto, mockReq);

      expect(projetsService.create).toHaveBeenCalledWith(dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'CREATE_PROJECT',
        'ADMIN',
        'Project: Projet Test',
        { code: 'PRJ1' },
      );
      expect(result).toEqual({ id: '1', nom: 'Projet Test', code: 'PRJ1' });
    });
  });

  describe('update', () => {
    it('should update a projet and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = { nom: 'Projet Test Updated' };

      const result = await controller.update('1', dto, mockReq);

      expect(projetsService.update).toHaveBeenCalledWith('1', dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'UPDATE_PROJECT',
        'ADMIN',
        'Project: Projet Test Updated',
        { changes: dto },
      );
      expect(result).toEqual({ id: '1', nom: 'Projet Test Updated' });
    });
  });

  describe('delete', () => {
    it('should delete a projet and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;

      const result = await controller.delete('1', mockReq);

      expect(projetsService.delete).toHaveBeenCalledWith('1');
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'DELETE_PROJECT',
        'ADMIN',
        'Project: Projet Test Deleted (PRJ1)',
      );
      expect(result).toEqual({ message: 'Projet supprimé avec succès' });
    });
  });
});
