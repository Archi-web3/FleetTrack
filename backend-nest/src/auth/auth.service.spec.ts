/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findByIdWithPopulate: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      const mockReq = {} as Request;

      await expect(
        service.validateUser('bad@test.com', 'pass', mockReq),
      ).rejects.toThrow(UnauthorizedException);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'LOGIN_FAILED',
        'AUTH',
        'Email: bad@test.com',
        { reason: 'User not found' },
      );
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
        toObject: jest.fn().mockReturnValue({ nom: 'Test' }),
      };
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      const mockReq = {} as Request;

      await expect(
        service.validateUser('test@test.com', 'wrongpass', mockReq),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user without password if valid credentials', async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: jest
          .fn()
          .mockReturnValue({ nom: 'Test', motDePasse: 'hashed' }),
      };
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      const mockReq = {} as Request;

      const result = await service.validateUser(
        'test@test.com',
        'pass',
        mockReq,
      );

      expect((result as any).motDePasse).toBeUndefined();
      expect(result).toHaveProperty('nom', 'Test');
    });
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      usersService.findByEmail.mockResolvedValue({ id: '1' } as any);

      const dto = {
        nom: 'Test',
        email: 'exists@test.com',
        motDePasse: 'pass',
        pays: 'France',
        profil: 'User',
        base: 'B',
      };
      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });

    it('should create user and return token if email is new', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({
        _id: { toString: () => '1' },
        nom: 'Test',
        profil: 'User',
      } as any);

      const dto = {
        nom: 'Test',
        email: 'new@test.com',
        motDePasse: 'pass',
        pays: 'France',
        profil: 'User',
        base: 'B',
      };
      const result = await service.register(dto);

      expect(result).toHaveProperty('token', 'mock_token');
      expect(result).toHaveProperty('message');
    });
  });
});
