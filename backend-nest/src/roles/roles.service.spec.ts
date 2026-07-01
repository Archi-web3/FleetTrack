import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { Role } from './schemas/role.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(Role.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1', name: 'Admin' }),
            })),
            mockModel(),
          ),
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
