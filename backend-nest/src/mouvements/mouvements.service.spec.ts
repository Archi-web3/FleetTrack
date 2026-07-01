import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MouvementsService } from './mouvements.service';
import { Mouvement } from './schemas/mouvement.schema';
import { Lieu } from '../lieux/schemas/lieu.schema';
import { User } from '../users/schemas/user.schema';
import { MouvementsConflictService } from './mouvements-conflict.service';
import { MouvementsSecurityService } from './mouvements-security.service';
import { MailService } from '../notifications/mail.service';

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockResolvedValue(0),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

describe('MouvementsService', () => {
  let service: MouvementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MouvementsService,
        {
          provide: getModelToken(Mouvement.name),
          useValue: Object.assign(
            jest.fn().mockImplementation(() => ({
              save: jest.fn().mockResolvedValue({ _id: '1' }),
            })),
            mockModel(),
          ),
        },
        { provide: getModelToken(Lieu.name), useValue: mockModel() },
        { provide: getModelToken(User.name), useValue: mockModel() },
        {
          provide: MouvementsConflictService,
          useValue: { checkConflicts: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: MouvementsSecurityService,
          useValue: { validateCreate: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: MailService,
          useValue: { sendMail: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<MouvementsService>(MouvementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
