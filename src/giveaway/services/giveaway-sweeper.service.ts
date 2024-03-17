import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiveawaySweeper } from '../entities/giveaway-sweeper.entity';
import { Repository } from 'typeorm';
import {
  CreateGiveawaySweeperDto,
  UpdateGiveawaySweeperDto,
} from '../dtos/giveaway-sweeper.dto';
import { GiveawayService } from './giveaway.service';
import { SweeperService } from './sweeper.service';

@Injectable()
export class GiveawaySweeperService {
  constructor(
    @InjectRepository(GiveawaySweeper)
    private giveawaySweeperRepo: Repository<GiveawaySweeper>,
    private giveawayService: GiveawayService,
    private sweeperService: SweeperService,
  ) { }

  async generateWinner() {
    const sweepers = await this.sweeperService.findAll();
    const winners = [];
    while (winners.length < 3) {
      for (const sweeper of sweepers) {
        const probability = Math.random();
        if (probability < 0.5 && winners.length < 3) {
          winners.push(sweeper);
        }
      }
    }

    return winners;
  }

  async createGiveawaySweeper(data: CreateGiveawaySweeperDto) {
    console.log(data);
    try {
      const giveawaySweeper = await this.findOne(
        data.fk_id_giveaway,
        data.fk_id_sweeper,
        data.winner,
      );
      console.log(giveawaySweeper);
      if (giveawaySweeper.code === 400) {
        console.log(
          `Datos sorteo con participantes previo crear: ${data.fk_id_giveaway}, ${data.fk_id_sweeper}, ${data.winner}`,
        );
        const newGiveawaySweeper = this.giveawaySweeperRepo.create(data);
        return this.giveawaySweeperRepo.save(newGiveawaySweeper);
      } else {
        throw new NotFoundException(
          `Sorteo con participantes con id de sorteo #${data.fk_id_giveaway} y id de participantes #${data.fk_id_sweeper} ya se encuentra registrado`,
        );
      }
      return giveawaySweeper;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas creando el sorteo con participantes: ${error}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.giveawaySweeperRepo.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas encontrando los sorteos con participantes: ${error}`,
      );
    }
  }

  async findOne(fk_giveaway: string, fk_sweeper: string, winner: boolean) {
    try {
      const giveawaySweeper = await this.giveawaySweeperRepo.findOne({
        // where: { giveaway.id: fk_giveaway,  },
      });
      if (!(giveawaySweeper instanceof GiveawaySweeper)) {
        throw new NotFoundException(
          `Sortes con participantes con id ___ no se encuentra en la Base de Datos`,
        );
      }
      return giveawaySweeper;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, cambios: UpdateGiveawaySweeperDto) {
    try {
      const giveawaySweeper = await this.giveawaySweeperRepo.findOne({
        where: { id_giveawaySweeper: id },
      });

      if (cambios.fk_id_giveaway) {
        const giveaway = await this.giveawayService.findOne(
          cambios.fk_id_giveaway,
        );
        giveawaySweeper.giveaway = giveaway;
      }

      if (cambios.fk_id_sweeper) {
        const sweeper = await this.sweeperService.findOne(
          cambios.fk_id_sweeper,
        );
        giveawaySweeper.sweeper = sweeper;
      }

      this.giveawaySweeperRepo.merge(giveawaySweeper, cambios);
      return this.giveawaySweeperRepo.save(giveawaySweeper);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Problemas actualizando el sorteo con participantes: ${error}`,
      );
    }
  }

  async remove(id: string) {
    const giveawaySweeper = await this.giveawaySweeperRepo.findOne({
      where: { id_giveawaySweeper: id },
    });

    return this.giveawaySweeperRepo.delete(giveawaySweeper);
  }
}
