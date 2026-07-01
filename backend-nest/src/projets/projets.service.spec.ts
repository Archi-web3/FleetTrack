import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProjetsService } from './projets.service';
import { Projet } from './schemas/projet.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('ProjetsService', () => {
  let service: ProjetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjetsService,
        {
          provide: getModelToken(Projet.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest
                .fn()
                .mockResolvedValue({ _id: '1', nom: 'Projet Test' }),
            })),
            mockModel(),
          ),
        },
      ],
    }).compile();

    service = module.get<ProjetsService>(ProjetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
