import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateAdministratorDto,
  UpdateAdministratorDto,
} from '../dtos/administrator.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdministratorService } from '../services/administrator.service';

@Controller('administrator')
export class AdministratorController {
  constructor(private administratorService: AdministratorService) {}

  @Get()
  findAll() {
    console.log('Entro al get de admnistrador');
    return this.administratorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administratorService.findOne(id);
  }

  @Get('correo/:correo')
  findOneByMail(@Param('correo') correo: string) {
    return this.administratorService.findOneByMail(correo);
  }
  @Get('documento/:documento')
  findOneByDocumento(@Param('documento') documento: number) {
    console.log(documento);
    return this.administratorService.findOneByDocumento(documento);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  // @UsePipes(new ValidationPipe({ transform: true }))
  createAdministrator(@Body() payload: CreateAdministratorDto) {
    console.log('payload admnistrador: ', payload);
    return this.administratorService.createAdministrator(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateAdministratorDto) {
    console.log('id: ' + id);
    console.log('datos: ' + payload.document);
    return this.administratorService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administratorService.remove(id);
  }
}
