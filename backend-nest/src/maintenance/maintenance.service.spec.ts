import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceConfig } from './schemas/maintenance-config.schema';
import { ChecklistTemplate } from './schemas/checklist-template.schema';
import { ServiceSchedule } from './schemas/service-schedule.schema';
import { WeeklyChecklist } from './schemas/weekly-checklist.schema';
import { Maintenance } from './schemas/maintenance.schema';
import { Vehicule } from '../vehicles/schemas/vehicule.schema';
import { User } from '../users/schemas/user.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockResolvedValue(0),
  aggregate: jest.fn().mockResolvedValue([]),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getModelToken(MaintenanceConfig.name),
          useValue: mockModel(),
        },
        {
          provide: getModelToken(ChecklistTemplate.name),
          useValue: mockModel(),
        },
        {
          provide: getModelToken(ServiceSchedule.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
        {
          provide: getModelToken(WeeklyChecklist.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
        {
          provide: getModelToken(Maintenance.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
        { provide: getModelToken(Vehicule.name), useValue: mockModel() },
        { provide: getModelToken(User.name), useValue: mockModel() },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
