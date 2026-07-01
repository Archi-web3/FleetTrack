import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EnvironmentService } from './environment.service';
import { EnvironmentAction } from './schemas/environment-action.schema';
import { EnvironmentData } from './schemas/environment-data.schema';
import { Fuel } from '../fuel/schemas/fuel.schema';
import { Mouvement } from '../mouvements/schemas/mouvement.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  aggregate: jest.fn().mockResolvedValue([]),
  exec: jest.fn().mockResolvedValue([]),
});

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: getModelToken(EnvironmentAction.name),
          useValue: mockModel(),
        },
        { provide: getModelToken(EnvironmentData.name), useValue: mockModel() },
        { provide: getModelToken(Fuel.name), useValue: mockModel() },
        { provide: getModelToken(Mouvement.name), useValue: mockModel() },
      ],
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
