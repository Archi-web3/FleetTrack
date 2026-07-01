import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GenerateursService } from './generateurs.service';
import { Generateur } from './schemas/generateur.schema';
import { GenerateurLogbook } from '../logbook/schemas/logbook.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('GenerateursService', () => {
  let service: GenerateursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateursService,
        { provide: getModelToken(Generateur.name), useValue: mockModel() },
        {
          provide: getModelToken(GenerateurLogbook.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
      ],
    }).compile();

    service = module.get<GenerateursService>(GenerateursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
