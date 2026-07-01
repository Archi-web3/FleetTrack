import { Test, TestingModule } from '@nestjs/testing';
import { MouvementsController } from './mouvements.controller';
import { MouvementsService } from './mouvements.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('MouvementsController', () => {
  let controller: MouvementsController;
  let mouvementsService: jest.Mocked<Partial<MouvementsService>>;

  beforeEach(async () => {
    mouvementsService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', date: '2023-01-01' }]),
      findById: jest.fn().mockResolvedValue({ id: '1', date: '2023-01-01' }),
      create: jest.fn().mockResolvedValue({ id: '1', date: '2023-01-01' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MouvementsController],
      providers: [{ provide: MouvementsService, useValue: mouvementsService }],
    }).compile();

    controller = module.get<MouvementsController>(MouvementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of mouvements', async () => {
      const result = await controller.findAll({});
      expect(mouvementsService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([{ id: '1', date: '2023-01-01' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single mouvement', async () => {
      const result = await controller.findOne('1');
      expect(mouvementsService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', date: '2023-01-01' });
    });
  });

  describe('create', () => {
    it('should create a mouvement without force', async () => {
      const mockReq = { user: { id: 'user1' } } as AuthRequest;
      const dto = {
        passagers: [],
        type: 'Aller simple',
        chauffeur: '1',
        vehicule: '1',
        dateHeure: '2023-01-01',
        depart: 'A',
        arrivee: 'B',
        distancePrevue: 10,
      };

      const result = await controller.create(dto, mockReq, 'false');

      expect(mouvementsService.create).toHaveBeenCalledWith(
        dto,
        mockReq.user,
        false,
      );
      expect(result).toEqual({ id: '1', date: '2023-01-01' });
    });

    it('should create a mouvement with force conflict', async () => {
      const mockReq = { user: { id: 'user1' } } as AuthRequest;
      const dto = {
        passagers: [],
        type: 'Aller simple',
        chauffeur: '1',
        vehicule: '1',
        dateHeure: '2023-01-01',
        depart: 'A',
        arrivee: 'B',
        distancePrevue: 10,
      };

      const result = await controller.create(dto, mockReq, 'true');

      expect(mouvementsService.create).toHaveBeenCalledWith(
        dto,
        mockReq.user,
        true,
      );
      expect(result).toEqual({ id: '1', date: '2023-01-01' });
    });
  });
});
