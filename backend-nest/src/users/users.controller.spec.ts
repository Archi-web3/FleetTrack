import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nom: 'Test User' }]),
      findByIdWithPopulate: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'Test User' }),
      create: jest
        .fn()
        .mockResolvedValue({ id: '1', nom: 'New User', profil: 'Admin' }),
      update: jest.fn().mockResolvedValue({ id: '1', nom: 'Updated User' }),
      delete: jest.fn().mockResolvedValue({
        id: '1',
        nom: 'Deleted User',
        email: 'test@test.com',
        profil: 'User',
      }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const mockReq = {
        user: { profil: 'Admin', pays: 'France' },
      } as AuthRequest;
      const result = await controller.findAll(mockReq);

      expect(usersService.findAll).toHaveBeenCalledWith({ pays: 'France' });
      expect(result).toEqual([{ id: '1', nom: 'Test User' }]);
    });

    it('should query without filter if not admin or missing pays', async () => {
      const mockReq = { user: { profil: 'User' } } as AuthRequest;
      const result = await controller.findAll(mockReq);

      expect(usersService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([{ id: '1', nom: 'Test User' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne('1');
      expect(usersService.findByIdWithPopulate).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', nom: 'Test User' });
    });
  });

  describe('create', () => {
    it('should create a user and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = {
        nom: 'New User',
        email: 'new@test.com',
        motDePasse: 'pass',
        pays: 'France',
        profil: 'Admin',
        base: 'Base1',
      };

      const result = await controller.create(dto, mockReq);

      expect(usersService.create).toHaveBeenCalledWith(dto, mockReq.user);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'CREATE_USER',
        'ADMIN',
        'User: New User',
        { role: 'Admin' },
      );
      expect(result).toEqual({ id: '1', nom: 'New User', profil: 'Admin' });
    });
  });

  describe('update', () => {
    it('should update a user and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;
      const dto = { nom: 'Updated User' };

      const result = await controller.update('1', dto, mockReq);

      expect(usersService.update).toHaveBeenCalledWith('1', dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'UPDATE_USER',
        'ADMIN',
        'User: Updated User',
        { changes: dto },
      );
      expect(result).toEqual({ id: '1', nom: 'Updated User' });
    });
  });

  describe('delete', () => {
    it('should delete a user and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as AuthRequest;

      const result = await controller.delete('1', mockReq);

      expect(usersService.delete).toHaveBeenCalledWith('1');
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'DELETE_USER',
        'ADMIN',
        'User: Deleted User (test@test.com)',
        { role: 'User' },
      );
      expect(result).toEqual({ message: 'Utilisateur supprimé' });
    });
  });
});
