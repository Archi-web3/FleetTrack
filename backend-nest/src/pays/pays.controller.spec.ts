import { Test, TestingModule } from '@nestjs/testing';
import { PaysController } from './pays.controller';
import { PaysService } from './pays.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('PaysController', () => {
  let controller: PaysController;
  let paysService: jest.Mocked<Partial<PaysService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    paysService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nom: 'France' }]),
      create: jest.fn().mockResolvedValue({ id: '1', nom: 'France' }),
      update: jest.fn().mockResolvedValue({ id: '1', nom: 'France' }),
      delete: jest.fn().mockResolvedValue({ id: '1', nom: 'France' }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaysController],
      providers: [
        { provide: PaysService, useValue: paysService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    controller = module.get<PaysController>(PaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of pays', async () => {
      const result = await controller.findAll();
      expect(paysService.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1', nom: 'France' }]);
    });
  });

  describe('create', () => {
    it('should create a pays', async () => {
      const mockReq = { user: { id: 'admin1' } };
      const dto = { nom: 'France' };
      const result = await controller.create(dto, mockReq);

      expect(paysService.create).toHaveBeenCalledWith(dto);
      expect(auditLogsService.logAction).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', nom: 'France' });
    });
  });

  describe('update', () => {
    it('should update a pays', async () => {
      const mockReq = { user: { id: 'admin1' } };
      const dto = { nom: 'France' };
      const result = await controller.update('1', dto, mockReq);

      expect(paysService.update).toHaveBeenCalledWith('1', dto);
      expect(auditLogsService.logAction).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', nom: 'France' });
    });
  });

  describe('delete', () => {
    it('should delete a pays', async () => {
      const mockReq = { user: { id: 'admin1' } };
      const result = await controller.delete('1', mockReq);

      expect(paysService.delete).toHaveBeenCalledWith('1');
      expect(auditLogsService.logAction).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Pays supprimé avec succès' });
    });
  });
});
