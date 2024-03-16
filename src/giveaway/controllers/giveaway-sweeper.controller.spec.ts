import { Test, TestingModule } from '@nestjs/testing';
import { GiveawaySweeperController } from './giveaway-sweeper.controller';

describe('GiveawaySweeperController', () => {
  let controller: GiveawaySweeperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiveawaySweeperController],
    }).compile();

    controller = module.get<GiveawaySweeperController>(GiveawaySweeperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
