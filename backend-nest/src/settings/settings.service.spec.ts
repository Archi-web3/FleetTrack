import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { Setting } from './schemas/setting.schema';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findOneAndUpdate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(null),
});

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: getModelToken(Setting.name), useValue: mockModel() },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
