import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSweeperDto, UpdateSweeperDto } from '../dtos/sweeper.dto';
import { SweeperService } from '../services/sweeper.service';

@ApiTags('Sweeper')
@Controller('sweeper')
export class SweeperController {
  constructor(private sweeperService: SweeperService) {}

  @Get()
  findAll() {
    console.log('Entro al get de sweeper');
    return this.sweeperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweeperService.findOne(id);
  }

  @Get('username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.sweeperService.findOneByUsername(username);
  }

  @Get('idDiscord/:id_discord')
  findOneByIdDiscord(@Param('id_discord') id_discord: string) {
    console.log(id_discord);
    return this.sweeperService.findOneByIdDiscord(id_discord);
  }

  @Post()
  createSweeper(@Body() payload: CreateSweeperDto) {
    console.log('payload sweeper: ', payload);
    return this.sweeperService.createSweeper(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateSweeperDto) {
    console.log('id: ' + id);
    console.log('datos: ' + payload.id_discord);
    return this.sweeperService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sweeperService.remove(id);
  }
}
