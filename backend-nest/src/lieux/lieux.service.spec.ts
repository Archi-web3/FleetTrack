import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LieuxService } from './lieux.service';
import { Lieu } from './schemas/lieu.schema';
import { Base } from '../bases/schemas/base.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('LieuxService', () => {
  let service: LieuxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LieuxService,
        {
          provide: getModelToken(Lieu.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
        { provide: getModelToken(Base.name), useValue: mockModel() },
      ],
    }).compile();

    service = module.get<LieuxService>(LieuxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
