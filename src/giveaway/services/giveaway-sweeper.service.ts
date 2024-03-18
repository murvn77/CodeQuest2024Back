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

  async generateWinner(id_giveaway: string) {
    const sweepers = await this.findSweepersByGiveaway(id_giveaway);
    const winners = [];
    let winnersComplete = false

    if (sweepers != 0) {
      while (!winnersComplete) {
        for (const sweeper of sweepers) {
          const probability = Math.random();
          if (probability < 0.5 && winners.length < 3) {
            winners.push(sweeper);
          } else {
            winnersComplete = true
          }
        }
      }
    }

    return winners;
  }

  async createGiveawaySweeper(data: CreateGiveawaySweeperDto) {
    try {
      const giveaway = await this.giveawayService.findOne(data.fk_id_giveaway);
      const sweeper = await this.sweeperService.findOne(data.fk_id_sweeper);

      const giveawaySweeper = await this.giveawaySweeperRepo.findOne({
        where: { giveaway: giveaway, sweeper: sweeper }
      });

      if (!(giveawaySweeper instanceof GiveawaySweeper)) {
        const newGiveawaySweeper = this.giveawaySweeperRepo.create(data);

        newGiveawaySweeper.sweeper = sweeper;
        newGiveawaySweeper.giveaway = giveaway;

        return this.giveawaySweeperRepo.save(newGiveawaySweeper);
      } else {
        throw new NotFoundException(
          `Sorteo con participantes con id de sorteo #${data.fk_id_giveaway} y id de participantes #${data.fk_id_sweeper} ya se encuentra registrado`,
        );
      }
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

  async findSweepersByGiveaway(id_giveaway: string) {
    try {
      const giveaway = await this.giveawayService.findOne(id_giveaway);

      const giveawaySweepers = await this.giveawaySweeperRepo.find({
        where: { giveaway: giveaway },
        relations: ['giveaway', 'sweeper']
      })

      const sweepersInGiveaway = [];

      for (const gs of giveawaySweepers) {
        sweepersInGiveaway.push(gs.sweeper)
      }
    
      console.log(sweepersInGiveaway);

      return sweepersInGiveaway;
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
