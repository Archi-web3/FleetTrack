import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WaiversService } from './waivers.service';
import { Waiver } from './schemas/waiver.schema';
import { UploadsService } from '../uploads/uploads.service';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('WaiversService', () => {
  let service: WaiversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaiversService,
        {
          provide: getModelToken(Waiver.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
        {
          provide: UploadsService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue('http://url.com/file.pdf'),
          },
        },
      ],
    }).compile();

    service = module.get<WaiversService>(WaiversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
