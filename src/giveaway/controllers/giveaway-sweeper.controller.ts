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

@ApiTags('Giveaway-Sweeper')
@Controller('giveaway-sweeper')
export class GiveawaySweeperController {
  constructor(private giveawaySweeperService: GiveawaySweeperService) {}

  @Get('/generateWinners/:id_giveaway')
  generateWinner(@Param('id_giveaway') id_giveaway: string) {
    console.log('Entro al get de generar ganador');
    return this.giveawaySweeperService.generateWinner(id_giveaway);
  }

  @Get()
  findAll() {
    console.log('Entro al get de giveaway-sweeper');
    return this.giveawaySweeperService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //     return this.giveawaySweeperService.findOne(id);
  // }

  @Post()
  // @ApiConsumes('multipart/form-data')
  // @UsePipes(new ValidationPipe({ transform: true }))
  createGiveawaySweeper(@Body() payload: CreateGiveawaySweeperDto) {
    console.log('payload giveaway-sweeper: ', payload);
    return this.giveawaySweeperService.createGiveawaySweeper(payload);
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
