import { Module } from '@nestjs/common';
import { GiveawayService } from './services/giveaway.service';
import { SweeperService } from './services/sweeper.service';
import { GiveawaySweeperService } from './services/giveaway-sweeper.service';
import { GiveawaySweeperController } from './controllers/giveaway-sweeper.controller';
import { SweeperController } from './controllers/sweeper.controller';
import { GiveawayController } from './controllers/giveaway.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Giveaway } from './entities/giveaway.entity';
import { GiveawaySweeper } from './entities/giveaway-sweeper.entity';
import { Sweeper } from './entities/sweeper.entity';
import { Administrator } from 'src/user/entities/administrator.entity';
import { AdministratorService } from 'src/user/services/administrator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Giveaway,
      GiveawaySweeper,
      Sweeper,
      Administrator,
    ]),
  ],
  providers: [
    GiveawayService,
    SweeperService,
    GiveawaySweeperService,
    AdministratorService,
  ],
  controllers: [
    GiveawaySweeperController,
    SweeperController,
    GiveawayController,
  ],
})
export class GiveawayModule {}
