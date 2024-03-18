import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sweeper } from '../entities/sweeper.entity';
import { Repository } from 'typeorm';
import { CreateSweeperDto, UpdateSweeperDto } from '../dtos/sweeper.dto';

@Injectable()
export class SweeperService {
  constructor(
    @InjectRepository(Sweeper)
    private sweeperRepo: Repository<Sweeper>,
  ) {}

  async createSweeper(data: CreateSweeperDto) {
    console.log(data);
    try {
      const sweeper = await this.findOneByIdDiscord(data.id_discord);
      console.log(sweeper);
      if (sweeper.code === 400) {
        console.log(
          `Datos sweeper previo crear: ${data.username}, ${data.avatar}`,
        );

        const newSweeper = this.sweeperRepo.create(data);
        newSweeper.avatar = data.avatar;

        return this.sweeperRepo.save(newSweeper);
      } else {
        throw new NotFoundException(
          `Sweeper con el ID Discord #${data.id_discord} ya se encuentra registrado`,
        );
      }
      return sweeper;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas creando el sweeper: ${error} `,
      );
    }
  }

  async findAll() {
    try {
      return await this.sweeperRepo.find({
        relations: ['giveawaySweeper']
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas encontrando los sweepers: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const sweeper = await this.sweeperRepo.findOne({
        where: { id_sweeper: id },
        relations: ['giveawaySweeper']
      });
      if (!(sweeper instanceof Sweeper)) {
        throw new NotFoundException(
          `Sweeper con id #${id} no se encuentra en la Base de Datos`,
        );
      }
      return sweeper;
    } catch (error) {
      return error;
    }
  }

  async findOneByUsername(username: string) {
    try {
      const sweeper = await this.sweeperRepo.findOne({
        where: { username: username },
        relations: ['giveawaySweeper']
      });
      if (!(sweeper instanceof Sweeper)) {
        throw new NotFoundException(
          `Sweeper con el username ${username} no se encuentra en la Base de Datos`,
        );
      }
      return sweeper;
    } catch (error) {
      return error;
    }
  }

  async findOneByIdDiscord(id_discord: string) {
    try {
      console.log('ID Discord: ', id_discord);
      const sweeper = await this.sweeperRepo.findOne({
        where: { id_discord: id_discord },
        relations: ['giveawaySweeper']
      });
      console.log('Sweeper: ', sweeper);
      if (!(sweeper instanceof Sweeper)) {
        return { code: 400, message: 'Sweeper no registrado' };
      }
      return sweeper;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, cambios: UpdateSweeperDto) {
    try {
      const sweeper = await this.sweeperRepo.findOne({
        where: { id_sweeper: id },
      });
      this.sweeperRepo.merge(sweeper, cambios);
      return this.sweeperRepo.save(sweeper);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas actualizando el sweeper: ${error}`,
      );
    }
  }

  async remove(id: string) {
    return this.sweeperRepo.delete(id);
  }
}
