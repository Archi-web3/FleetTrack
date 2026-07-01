/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Utilisateur } from './schemas/user.schema';
import { BadRequestException } from '@nestjs/common';

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(Utilisateur.name),
          useValue: jest.fn().mockImplementation(() => ({
            save: jest
              .fn()
              .mockResolvedValue({ _id: '1', nom: 'Test', profil: 'User' }),
            toObject: jest
              .fn()
              .mockReturnValue({ _id: '1', nom: 'Test', profil: 'User' }),
          })),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    // Attach mock methods to the injected model
    const model = module.get(getModelToken(Utilisateur.name));
    Object.assign(model, mockUserModel);
    (service as any).userModel = model;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException when Admin tries to create another Admin', async () => {
      const creator = { profil: 'Admin', pays: 'France' } as any;
      const dto = {
        nom: 'User',
        email: 'u@u.com',
        motDePasse: 'pass',
        pays: 'France',
        profil: 'Admin',
        base: 'B',
      };

      await expect(service.create(dto, creator)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should force pays to be creator pays when Admin creates user', async () => {
      const creator = { profil: 'Admin', pays: 'France' } as any;
      const dto = {
        nom: 'User',
        email: 'u@u.com',
        motDePasse: 'pass',
        pays: 'Other',
        profil: 'User',
        base: 'B',
      };

      const mockSave = jest.fn().mockResolvedValue({
        _id: '1',
        nom: 'User',
        profil: 'User',
        pays: 'France',
      });
      (service as any).userModel = jest
        .fn()
        .mockImplementation(() => ({ save: mockSave }));

      await service.create(dto, creator);

      // The pays should have been overwritten with creator's pays
      expect(dto.pays).toBe('France');
    });
  });
});
