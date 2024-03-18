import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Giveaway } from '../entities/giveaway.entity';
import { Repository } from 'typeorm';
import { CreateGiveawayDto, UpdateGiveawayDto } from '../dtos/giveaway.dto';
import { AdministratorService } from 'src/user/services/administrator.service';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GiveawayService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Giveaway)
    private giveawayRepo: Repository<Giveaway>,
    private adminitratorService: AdministratorService,
  ) { }

  async createGiveaway(data: CreateGiveawayDto) {
    console.log(data);
    try {
      const giveaway = await this.findOneByName(data.name);
      console.log(giveaway);
      if (giveaway.code === 400) {
        console.log(
          `Datos sorteo previo crear: ${data.name}, ${data.description}`,
        );

        const newGiveaway = this.giveawayRepo.create(data);

        const admin = await this.adminitratorService.findOne(data.fk_id_administrator);
        newGiveaway.administrator = admin
        // newGiveaway.image = imageBase64;

        return this.giveawayRepo.save(newGiveaway);
      } else {
        throw new NotFoundException(
          `Sorteo con el nombre ${data.name} ya se encuentra registrado`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas creando el sorteo: ${error}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.giveawayRepo.find({
        relations: ['giveawaySweeper', 'administrator']
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas encontrando los sorteos: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const giveaway = await this.giveawayRepo.findOne({
        where: { id_giveaway: id },
        relations: ['giveawaySweeper', 'administrator']
      });
      if (!(giveaway instanceof Giveaway)) {
        throw new NotFoundException(
          `Giveaway con id #${id} no se encuentra en la Base de Datos`,
        );
      }
      return giveaway;
    } catch (error) {
      return error;
    }
  }

  async findOneByName(name: string) {
    try {
      console.log('Name: ', name);
      const giveaway = await this.giveawayRepo.findOne({
        where: { name: name },
        relations: ['giveawaySweeper', 'administrator']
      });
      console.log('Giveaway: ', giveaway);
      if (!(giveaway instanceof Giveaway)) {
        return { code: 400, message: 'Sorteo no registrado' };
      }
      return giveaway;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, cambios: UpdateGiveawayDto) {
    try {
      const giveaway = await this.giveawayRepo.findOne({
        where: { id_giveaway: id },
      });

      if (cambios.fk_id_administrator) {
        const admin = await this.adminitratorService.findOne(
          cambios.fk_id_administrator,
        );
        giveaway.administrator = admin;
      }

      this.giveawayRepo.merge(giveaway, cambios);
      return this.giveawayRepo.save(giveaway);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas actualizando el sorteo: ${error}`,
      );
    }
  }

  async remove(id: string) {
    const giveaway = await this.giveawayRepo.findOne({
      where: { id_giveaway: id },
    });

    return this.giveawayRepo.delete(giveaway);
  }
}
