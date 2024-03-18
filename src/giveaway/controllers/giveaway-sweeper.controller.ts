import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GiveawaySweeperService } from '../services/giveaway-sweeper.service';
import {
  CreateGiveawaySweeperDto,
  UpdateGiveawaySweeperDto,
} from '../dtos/giveaway-sweeper.dto';
import { Giveaway } from '../entities/giveaway.entity';
import { Sweeper } from '../entities/sweeper.entity';

@ApiTags('Giveaway-Sweeper')
@Controller('giveaway-sweeper')
export class GiveawaySweeperController {
  constructor(private giveawaySweeperService: GiveawaySweeperService) {}

  @Get('/generateWinners/giveaway/:id_giveaway')
  generateWinner(@Param('id_giveaway') id_giveaway: string) {
    console.log('Entro al get de generar ganador');
    return this.giveawaySweeperService.generateWinner(id_giveaway);
  }

  @Get()
  findAll() {
    console.log('Entro al get de giveaway-sweeper');
    return this.giveawaySweeperService.findAll();
  }

  @Get('/giveaway/:giveaway/sweeper/:sweeper')
  findOne(@Param('giveaway') giveaway: Giveaway, @Param('sweeper') sweeper: Sweeper) {
      return this.giveawaySweeperService.findOne(giveaway, sweeper);
  }

  @Post()
  createGiveawaySweeper(@Body() payload: CreateGiveawaySweeperDto) {
    return this.giveawaySweeperService.createGiveawaySweeper(payload);
  }

  @Get('/sweepersNotIn/giveaway/:giveaway')
  findSweepersNotInGiveaway(@Param('giveaway') giveaway: Giveaway) {
    console.log('payload giveaway-sweeper: ', giveaway);
    return this.giveawaySweeperService.findSweepersNotInGiveaway(giveaway);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateGiveawaySweeperDto) {
    console.log('id: ' + id);
    console.log(
      'id_giveaway: ' +
        payload.fk_id_giveaway +
        'id_sweeper: ' +
        payload.fk_id_sweeper,
    );
    return this.giveawaySweeperService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giveawaySweeperService.remove(id);
  }
}
