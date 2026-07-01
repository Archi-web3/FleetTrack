/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ChauffeursController } from './chauffeurs.controller';
import { UsersService } from '../users/users.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('ChauffeursController', () => {
  let controller: ChauffeursController;
  let usersService: jest.Mocked<Partial<UsersService>>;

  beforeEach(async () => {
    usersService = {
      findAll: jest
        .fn()
        .mockResolvedValue([
          { id: '1', nom: 'Chauffeur Test', profil: 'Chauffeur' },
        ]),
      findByIdWithPopulate: jest.fn().mockResolvedValue({
        id: '1',
        nom: 'Chauffeur Test',
        profil: 'Chauffeur',
      }),
      create: jest.fn().mockResolvedValue({
        toObject: () => ({
          id: '1',
          nom: 'Chauffeur Test',
          profil: 'Chauffeur',
          motDePasse: 'secret',
        }),
      } as any),
      update: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Chauffeur Updated' }),
      delete: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Chauffeur Deleted' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChauffeursController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<ChauffeursController>(ChauffeursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of chauffeurs', async () => {
      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalledWith({
        profil: { $in: ['Chauffeur', 'driver'] },
      });
      expect(result).toEqual([
        { id: '1', nom: 'Chauffeur Test', profil: 'Chauffeur' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a chauffeur if found and profil is Chauffeur', async () => {
      const result = await controller.findOne('1');
      expect(usersService.findByIdWithPopulate).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: '1',
        nom: 'Chauffeur Test',
        profil: 'Chauffeur',
      });
    });

    it('should return null if user is not a chauffeur', async () => {
      usersService.findByIdWithPopulate.mockResolvedValueOnce({
        id: '2',
        profil: 'Admin',
      } as any);
      const result = await controller.findOne('2');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a chauffeur and remove password from response', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = {
        nom: 'Chauffeur Test',
        email: 'c@c.com',
        motDePasse: 'pass',
        pays: 'France',
        profil: 'Admin',
        base: 'Base1',
      };

      const result = await controller.create(dto, mockReq);

      expect(dto.profil).toBe('Chauffeur');
      expect(usersService.create).toHaveBeenCalledWith(dto, mockReq.user);
      expect(result).toEqual({
        id: '1',
        nom: 'Chauffeur Test',
        profil: 'Chauffeur',
      });
      expect((result as any).motDePasse).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a chauffeur', async () => {
      const dto = { nom: 'Chauffeur Updated' };

      const result = await controller.update('1', dto);

      expect(usersService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual({ id: '1', nom: 'Chauffeur Updated' });
    });
  });

  describe('delete', () => {
    it('should delete a chauffeur', async () => {
      const result = await controller.delete('1');

      expect(usersService.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Chauffeur supprimé' });
    });
  });
});
