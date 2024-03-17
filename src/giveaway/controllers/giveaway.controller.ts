import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GiveawayService } from '../services/giveaway.service';
import { CreateGiveawayDto, UpdateGiveawayDto } from '../dtos/giveaway.dto';

@Controller('giveaway')
export class GiveawayController {
    constructor(private giveawayService: GiveawayService) { }

    @Get()
    findAll() {
        console.log('Entro al get de sorteo');
        return this.giveawayService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.giveawayService.findOne(id);
    }

    @Get('nombre/:nombre')
    findOneByMail(@Param('nombre') nombre: string) {
        return this.giveawayService.findOneByName(nombre);
    }

    @Post()
    @ApiConsumes('multipart/form-data')
    // @UsePipes(new ValidationPipe({ transform: true }))
    createGiveaway(@Body() payload: CreateGiveawayDto) {
        console.log("payload giveaway: ", payload)
        return this.giveawayService.createGiveaway(payload);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() payload: UpdateGiveawayDto,
    ) {
        console.log('id: ' + id);
        console.log('datos: ' + payload.name);
        return this.giveawayService.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.giveawayService.remove(id);
    }
}
