import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { Vehicule } from '../vehicles/schemas/vehicule.schema';
import { Fuel } from '../fuel/schemas/fuel.schema';
import { Maintenance } from '../maintenance/schemas/maintenance.schema';
import { Incident } from '../logbook/schemas/incident.schema';
import { Mouvement } from '../mouvements/schemas/mouvement.schema';
import { SettingsService } from '../settings/settings.service';
import { Setting } from '../settings/schemas/setting.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  aggregate: jest.fn().mockResolvedValue([]),
  exec: jest.fn().mockResolvedValue([]),
});

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        SettingsService,
        { provide: getModelToken(Vehicule.name), useValue: mockModel() },
        { provide: getModelToken(Fuel.name), useValue: mockModel() },
        { provide: getModelToken(Maintenance.name), useValue: mockModel() },
        { provide: getModelToken(Incident.name), useValue: mockModel() },
        { provide: getModelToken(Mouvement.name), useValue: mockModel() },
        {
          provide: getModelToken(Setting.name),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
