import { Test, TestingModule } from '@nestjs/testing';
import { SweeperService } from './sweeper.service';

describe('SweeperService', () => {
  let service: SweeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SweeperService],
    }).compile();

    service = module.get<SweeperService>(SweeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
