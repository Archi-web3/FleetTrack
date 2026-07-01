import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LogbookService } from './logbook.service';
import { Fuel } from '../fuel/schemas/fuel.schema';
import { Incident } from './schemas/incident.schema';
import { Mouvement } from '../mouvements/schemas/mouvement.schema';
import { Utilisateur } from '../users/schemas/user.schema';
import { Maintenance } from '../maintenance/schemas/maintenance.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('LogbookService', () => {
  let service: LogbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogbookService,
        { provide: getModelToken(Fuel.name), useValue: mockModel() },
        { provide: getModelToken(Incident.name), useValue: mockModel() },
        { provide: getModelToken(Mouvement.name), useValue: mockModel() },
        { provide: getModelToken(Utilisateur.name), useValue: mockModel() },
        { provide: getModelToken(Maintenance.name), useValue: mockModel() },
      ],
    }).compile();

    service = module.get<LogbookService>(LogbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
