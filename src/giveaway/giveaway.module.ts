import { Module } from '@nestjs/common';
import { GiveawayService } from './services/giveaway.service';
import { SweeperService } from './services/sweeper.service';
import { GiveawaySweeperService } from './services/giveaway-sweeper.service';
import { GiveawaySweeperController } from './controllers/giveaway-sweeper.controller';
import { SweeperController } from './controllers/sweeper.controller';
import { GiveawayController } from './controllers/giveaway.controller';

@Module({
  providers: [GiveawayService, SweeperService, GiveawaySweeperService],
  controllers: [GiveawaySweeperController, SweeperController, GiveawayController]
})
export class GiveawayModule {}
