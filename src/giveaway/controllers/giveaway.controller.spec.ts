import { Test, TestingModule } from '@nestjs/testing';
import { GiveawayController } from './giveaway.controller';

describe('GiveawayController', () => {
  let controller: GiveawayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiveawayController],
    }).compile();

    controller = module.get<GiveawayController>(GiveawayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
