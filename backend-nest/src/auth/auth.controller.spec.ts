import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { AuthRequest } from '../analytics/analytics.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Partial<AuthService>>;

  beforeEach(async () => {
    authService = {
      validateUser: jest
        .fn()
        .mockResolvedValue({ id: '1', email: 'test@test.com' }),
      login: jest
        .fn()
        .mockResolvedValue({ access_token: 'test_token', user: { id: '1' } }),
      register: jest.fn().mockResolvedValue({ id: '2', email: 'new@test.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should validate user and return token', async () => {
      const mockReq = {} as AuthRequest;
      const dto = { email: 'test@test.com', motDePasse: 'pass' };

      const result = await controller.login(dto, mockReq);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@test.com',
        'pass',
        mockReq,
      );
      expect(mockReq.user).toEqual({ id: '1', email: 'test@test.com' });
      expect(authService.login).toHaveBeenCalledWith(
        { id: '1', email: 'test@test.com' },
        mockReq,
      );
      expect(result).toEqual({ access_token: 'test_token', user: { id: '1' } });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'new@test.com',
        nom: 'New User',
        motDePasse: 'pass',
        pays: 'France',
        profil: 'User',
        base: 'Base1',
      };

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '2', email: 'new@test.com' });
    });
  });
});
