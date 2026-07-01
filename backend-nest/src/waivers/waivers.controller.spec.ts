/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { WaiversController } from './waivers.controller';
import { WaiversService } from './waivers.service';
import { BadRequestException } from '@nestjs/common';

describe('WaiversController', () => {
  let controller: WaiversController;
  let waiversService: jest.Mocked<Partial<WaiversService>>;

  beforeEach(async () => {
    waiversService = {
      createWaiver: jest
        .fn()
        .mockResolvedValue({ id: '1', passengerName: 'Test' }),
      getAllWaivers: jest
        .fn()
        .mockResolvedValue([{ id: '1', passengerName: 'Test' }]),
      deleteWaiver: jest.fn().mockResolvedValue({ message: 'Deleted' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaiversController],
      providers: [{ provide: WaiversService, useValue: waiversService }],
    }).compile();

    controller = module.get<WaiversController>(WaiversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createWaiver', () => {
    it('should throw BadRequestException if no file and no signatureUrl', async () => {
      await expect(
        controller.createWaiver(undefined as any, {} as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create waiver if file is provided', async () => {
      const result = await controller.createWaiver(
        {} as any,
        { passengerName: 'Test' } as any,
      );
      expect(waiversService.createWaiver).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', passengerName: 'Test' });
    });
  });

  describe('getAllWaivers', () => {
    it('should return all waivers', async () => {
      const result = await controller.getAllWaivers();
      expect(waiversService.getAllWaivers).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1', passengerName: 'Test' }]);
    });
  });

  describe('deleteWaiver', () => {
    it('should delete a waiver', async () => {
      const result = await controller.deleteWaiver('1');
      expect(waiversService.deleteWaiver).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Décharge supprimée avec succès' });
    });
  });
});
