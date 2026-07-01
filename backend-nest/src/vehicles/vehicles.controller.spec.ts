import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Request } from 'express';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';

interface AuthRequest extends Request {
  user: UserPayloadDto;
}

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let vehiclesService: jest.Mocked<Partial<VehiclesService>>;
  let auditLogsService: jest.Mocked<Partial<AuditLogsService>>;

  beforeEach(async () => {
    vehiclesService = {
      findAll: jest
        .fn()
        .mockResolvedValue([{ id: '1', immatriculation: 'AB-123-CD' }]),
      findById: jest
        .fn()
        .mockResolvedValue({ id: '1', immatriculation: 'AB-123-CD' }),
      create: jest.fn().mockResolvedValue({
        id: '1',
        immatriculation: 'AB-123-CD',
        marque: 'Toyota',
        modele: 'Corolla',
      }),
      update: jest.fn().mockResolvedValue({
        vehicule: { id: '1', immatriculation: 'AB-123-CD', marque: 'Toyota' },
      }),
      delete: jest.fn().mockResolvedValue({
        id: '1',
        immatriculation: 'AB-123-CD',
        marque: 'Toyota',
      }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        { provide: VehiclesService, useValue: vehiclesService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of vehicles and apply country filter for Admin', async () => {
      const mockReq = {
        user: { profil: 'Admin', pays: 'France' },
      } as unknown as AuthRequest;
      const result = await controller.findAll(mockReq);

      expect(vehiclesService.findAll).toHaveBeenCalledWith(mockReq.user, {
        pays: 'France',
      });
      expect(result).toEqual([{ id: '1', immatriculation: 'AB-123-CD' }]);
    });

    it('should query without country filter if not admin or superviseur', async () => {
      const mockReq = {
        user: { profil: 'User', pays: 'France' },
      } as unknown as AuthRequest;
      const result = await controller.findAll(mockReq);

      expect(vehiclesService.findAll).toHaveBeenCalledWith(mockReq.user, {});
      expect(result).toEqual([{ id: '1', immatriculation: 'AB-123-CD' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const result = await controller.findOne('1');
      expect(vehiclesService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1', immatriculation: 'AB-123-CD' });
    });
  });

  describe('create', () => {
    it('should create a vehicle and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as unknown as AuthRequest;
      const dto = {
        immatriculation: 'AB-123-CD',
        marque: 'Toyota',
        modele: 'Corolla',
        annee: 2020,
        pays: 'France',
        type: '4x4',
        energie: 'Diesel',
        kilometrage: 10000,
        statut: 'Actif',
        base: 'Base1',
      };

      const result = await controller.create(dto, mockReq);

      expect(vehiclesService.create).toHaveBeenCalledWith(dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'CREATE_VEHICLE',
        'ADMIN',
        'Vehicle: AB-123-CD',
        { brand: 'Toyota', model: 'Corolla' },
      );
      expect(result).toEqual({
        id: '1',
        immatriculation: 'AB-123-CD',
        marque: 'Toyota',
        modele: 'Corolla',
      });
    });
  });

  describe('update', () => {
    it('should update a vehicle and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as unknown as AuthRequest;
      const dto = { immatriculation: 'AB-123-CD' };

      const result = await controller.update('1', dto, mockReq);

      expect(vehiclesService.update).toHaveBeenCalledWith('1', dto);
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'UPDATE_VEHICLE',
        'ADMIN',
        'Vehicle: AB-123-CD',
        { changes: dto },
      );
      expect(result).toEqual({
        vehicule: { id: '1', immatriculation: 'AB-123-CD', marque: 'Toyota' },
      });
    });
  });

  describe('delete', () => {
    it('should delete a vehicle and log action', async () => {
      const mockReq = { user: { id: 'admin1' } } as unknown as AuthRequest;

      const result = await controller.delete('1', mockReq);

      expect(vehiclesService.delete).toHaveBeenCalledWith('1');
      expect(auditLogsService.logAction).toHaveBeenCalledWith(
        mockReq,
        'DELETE_VEHICLE',
        'ADMIN',
        'Vehicle: AB-123-CD',
        { brand: 'Toyota' },
      );
      expect(result).toEqual({ message: 'Vehicule supprimé' });
    });
  });
});
