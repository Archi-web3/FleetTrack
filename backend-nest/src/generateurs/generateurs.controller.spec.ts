/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateursController } from './generateurs.controller';
import { GenerateursService } from './generateurs.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('GenerateursController', () => {
  let controller: GenerateursController;
  let generateursService: jest.Mocked<Partial<GenerateursService>>;

  beforeEach(async () => {
    generateursService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nom: 'Gen 1' }]),
      getMaintenanceOverview: jest
        .fn()
        .mockResolvedValue({ total: 10, maintenance: 2 }),
      findById: jest.fn().mockResolvedValue({ id: '1', nom: 'Gen 1' }),
      create: jest.fn().mockResolvedValue({ id: '1', nom: 'Gen 1' }),
      update: jest.fn().mockResolvedValue({ id: '1', nom: 'Gen Updated' }),
      delete: jest.fn().mockResolvedValue({ id: '1', nom: 'Gen Deleted' }),
      getLogbooks: jest
        .fn()
        .mockResolvedValue([{ id: 'log1', generateur: '1' }]),
      addLogbookEntry: jest
        .fn()
        .mockResolvedValue({ id: 'log1', generateur: '1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateursController],
      providers: [
        { provide: GenerateursService, useValue: generateursService },
      ],
    }).compile();

    controller = module.get<GenerateursController>(GenerateursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of generateurs', async () => {
      const result = await controller.findAll();
      expect(generateursService.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1', nom: 'Gen 1' }]);
    });
  });

  describe('getMaintenanceOverview', () => {
    it('should return maintenance overview', async () => {
      const result = await controller.getMaintenanceOverview();
      expect(generateursService.getMaintenanceOverview).toHaveBeenCalled();
      expect(result).toEqual({ total: 10, maintenance: 2 });
    });
  });

  describe('findOne', () => {
    it('should return a single generateur', async () => {
      const result = await controller.findOne('1');
      expect(generateursService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', nom: 'Gen 1' });
    });
  });

  describe('create', () => {
    it('should create a generateur', async () => {
      const dto = { nom: 'Gen 1' };
      const result = await controller.create(dto);
      expect(generateursService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '1', nom: 'Gen 1' });
    });
  });

  describe('update', () => {
    it('should update a generateur', async () => {
      const dto = { nom: 'Gen Updated' };
      const result = await controller.update('1', dto as any);
      expect(generateursService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual({ id: '1', nom: 'Gen Updated' });
    });
  });

  describe('delete', () => {
    it('should delete a generateur', async () => {
      const result = await controller.delete('1');
      expect(generateursService.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Générateur supprimé' });
    });
  });

  describe('getLogbooks', () => {
    it('should return logbooks for a generateur', async () => {
      const result = await controller.getLogbooks('1');
      expect(generateursService.getLogbooks).toHaveBeenCalledWith('1');
      expect(result).toEqual([{ id: 'log1', generateur: '1' }]);
    });
  });

  describe('addLogbookEntry', () => {
    it('should add a logbook entry', async () => {
      const mockReq = { user: { id: 'user1' } } as AuthRequest;
      const dto = { heures: 10 };
      const result = await controller.addLogbookEntry('1', dto, mockReq);

      expect(generateursService.addLogbookEntry).toHaveBeenCalledWith(
        '1',
        dto,
        mockReq.user,
      );
      expect(result).toEqual({ id: 'log1', generateur: '1' });
    });
  });
});
