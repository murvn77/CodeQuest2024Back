import { Test, TestingModule } from '@nestjs/testing';
import { SweeperController } from './sweeper.controller';

describe('SweeperController', () => {
  let controller: SweeperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SweeperController],
    }).compile();

    controller = module.get<SweeperController>(SweeperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
