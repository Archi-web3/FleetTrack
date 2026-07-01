import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentController } from './environment.controller';
import { EnvironmentService } from './environment.service';

describe('EnvironmentController', () => {
  let controller: EnvironmentController;
  let environmentService: jest.Mocked<Partial<EnvironmentService>>;

  beforeEach(async () => {
    environmentService = {
      getActions: jest.fn().mockResolvedValue([{ id: '1' }]),
      createAction: jest.fn().mockResolvedValue({ id: '1' }),
      updateAction: jest.fn().mockResolvedValue({ id: '1' }),
      deleteAction: jest.fn().mockResolvedValue({ message: 'Deleted' }),
      getData: jest.fn().mockResolvedValue([{ id: 'd1' }]),
      upsertData: jest.fn().mockResolvedValue({ id: 'd1' }),
      aggregateStats: jest.fn().mockResolvedValue({ total: 10 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentController],
      providers: [
        { provide: EnvironmentService, useValue: environmentService },
      ],
    }).compile();

    controller = module.get<EnvironmentController>(EnvironmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getActions', () => {
    it('should return actions', async () => {
      const result = await controller.getActions(2023, 'Base1');
      expect(environmentService.getActions).toHaveBeenCalledWith(2023, 'Base1');
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('createAction', () => {
    it('should create an action', async () => {
      const dto = { name: 'Action1' };
      const result = await controller.createAction(dto);
      expect(environmentService.createAction).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('updateAction', () => {
    it('should update an action', async () => {
      const dto = { name: 'Action1' };
      const result = await controller.updateAction('1', dto);
      expect(environmentService.updateAction).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('deleteAction', () => {
    it('should delete an action', async () => {
      const result = await controller.deleteAction('1');
      expect(environmentService.deleteAction).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Deleted' });
    });
  });

  describe('getData', () => {
    it('should get data', async () => {
      const result = await controller.getData(2023, 'Base1');
      expect(environmentService.getData).toHaveBeenCalledWith(2023, 'Base1');
      expect(result).toEqual([{ id: 'd1' }]);
    });
  });

  describe('upsertData', () => {
    it('should upsert data', async () => {
      const dto = { year: 2023 };
      const result = await controller.upsertData(dto);
      expect(environmentService.upsertData).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 'd1' });
    });
  });

  describe('aggregateStats', () => {
    it('should return aggregate stats', async () => {
      const result = await controller.aggregateStats(2023, 1, 'Base1');
      expect(environmentService.aggregateStats).toHaveBeenCalledWith(
        2023,
        1,
        'Base1',
      );
      expect(result).toEqual({ total: 10 });
    });
  });
});
