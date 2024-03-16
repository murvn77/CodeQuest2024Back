import { Test, TestingModule } from '@nestjs/testing';
import { GiveawaySweeperService } from './giveaway-sweeper.service';

describe('GiveawaySweeperService', () => {
  let service: GiveawaySweeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiveawaySweeperService],
    }).compile();

    service = module.get<GiveawaySweeperService>(GiveawaySweeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
