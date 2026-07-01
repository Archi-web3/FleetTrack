import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from './schemas/vehicule.schema';
import { MaintenanceAutomationService } from '../maintenance/maintenance-automation.service';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getModelToken(Vehicule.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({
                _id: '1',
                immatriculation: 'AB-123-CD',
              }),
            })),
            mockModel(),
          ),
        },
        {
          provide: MaintenanceAutomationService,
          useValue: {
            initializeVehicleSchedule: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
