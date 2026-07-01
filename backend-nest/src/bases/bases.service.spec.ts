/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BasesService } from './bases.service';
import { Base } from './schemas/base.schema';

const mockSavedBase = {
  save: jest.fn().mockResolvedValue({
    _id: '1',
    nom: 'Base Test',
    populate: jest
      .fn()
      .mockResolvedValue({ _id: '1', nom: 'Base Test', pays: 'France' }),
  }),
};

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('BasesService', () => {
  let service: BasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BasesService,
        {
          provide: getModelToken(Base.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => mockSavedBase),
            mockModel(),
          ),
        },
      ],
    }).compile();

    service = module.get<BasesService>(BasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should force pays to be Admin country when user is Admin', async () => {
      const user = { profil: 'Admin', pays: 'France' } as any;
      const dto = { nom: 'Base Test', pays: 'Other' } as any;

      // Admin's pays should be forced onto the DTO
      await service.create(dto, user);
      expect(dto.pays).toBe('France');
    });

    it('should not modify pays if user is SuperAdmin', async () => {
      const user = { profil: 'SuperAdmin', pays: 'France' } as any;
      const dto = { nom: 'Base Test', pays: 'Germany' } as any;

      await service.create(dto, user);
      expect(dto.pays).toBe('Germany');
    });
  });
});
