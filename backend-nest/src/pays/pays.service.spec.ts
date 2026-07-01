import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaysService } from './pays.service';
import { Pays } from './schemas/pays.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('PaysService', () => {
  let service: PaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaysService,
        {
          provide: getModelToken(Pays.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1', nom: 'France' }),
            })),
            mockModel(),
          ),
        },
      ],
    }).compile();

    service = module.get<PaysService>(PaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
