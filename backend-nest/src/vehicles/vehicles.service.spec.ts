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

  it('should pass the country and base context filters to MongoDB', async () => {
    const vehiculeModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    } as unknown as Parameters<typeof VehiclesService>[0];

    const maintenanceAutomationService = {
      initializeVehicleSchedule: jest.fn().mockResolvedValue(undefined),
    } as unknown as Parameters<typeof VehiclesService>[1];

    const serviceWithMockedModel = new VehiclesService(
      vehiculeModel,
      maintenanceAutomationService,
    );

    await serviceWithMockedModel.findAll({ pays: 'country-1', base: 'base-2' });

    expect(vehiculeModel.find).toHaveBeenCalledWith({
      pays: 'country-1',
      base: 'base-2',
    });
  });
});
