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
import { Giveaway } from '../entities/giveaway.entity';
import { Sweeper } from '../entities/sweeper.entity';

@Injectable()
export class GiveawaySweeperService {
  constructor(
    @InjectRepository(GiveawaySweeper)
    private giveawaySweeperRepo: Repository<GiveawaySweeper>,
    private giveawayService: GiveawayService,
    private sweeperService: SweeperService,
  ) { }

  async generateWinner(id_giveaway: string) {
    try {
      const giveaway : Giveaway = await this.giveawayService.findOne(id_giveaway);
      const sweepers = await this.findSweepersByGiveaway(giveaway);

      const winners : Sweeper [] = [];
      while (winners.length < giveaway.number_winners && sweepers.length > 0) {
        const randomIndex = Math.floor(Math.random() * sweepers.length);
        const selectedSweeper = sweepers.splice(randomIndex, 1)[0];
        winners.push(selectedSweeper);
      }

      for (const winner of winners) {
        const giveawaySweeper = await this.findOne(giveaway, winner);
        giveawaySweeper.winner = true;
        await this.giveawaySweeperRepo.save(giveawaySweeper);
      }

      giveaway.state = false;
      await this.giveawayService.updateState(giveaway);

      return winners;
    } catch (error) {
      throw new InternalServerErrorException(
        `Problemas generando el o los ganadores del sorteo: ${error}`,
      );
    }
  }

  async createGiveawaySweeper(data: CreateGiveawaySweeperDto) {
    try {
      const giveaway = await this.giveawayService.findOne(data.fk_id_giveaway);
      const sweeper = await this.sweeperService.findOne(data.fk_id_sweeper);

      const giveawaySweeper = await this.findOne(giveaway, sweeper);

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

  async findOne(giveaway: Giveaway, sweeper: Sweeper) {
    try {
      const giveawaySweeper = await this.giveawaySweeperRepo.findOne({
        where: { giveaway: giveaway, sweeper: sweeper },
        relations: ['giveaway', 'sweeper']
      });
      if (!(giveawaySweeper instanceof GiveawaySweeper)) {
        throw new NotFoundException(
          `Sortes con participantes no se encuentra en la Base de Datos`,
        );
      }
      return giveawaySweeper;
    } catch (error) {
      return error;
    }
  }

  async findSweepersByGiveaway(giveaway: Giveaway) {
    try {
      const giveawaySweepers = await this.giveawaySweeperRepo.find({
        where: { giveaway: giveaway },
        relations: ['giveaway', 'sweeper']
      });

      const sweepersInGiveaway = giveawaySweepers.map(gs => gs.sweeper);

      if (sweepersInGiveaway.length === 0) {
        throw new NotFoundException(`Actualmente el sorteo con id ${giveaway.id_giveaway} no tiene participantes`);
      }

      return sweepersInGiveaway;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error("Ocurrió un error al buscar los participantes del sorteo");
      }
    }
  }

  async findSweepersNotInGiveaway(giveaway: Giveaway) {
    try {
      const giveawaySweepers = await this.giveawaySweeperRepo.find({
        where: { giveaway: giveaway },
        relations: ['giveaway', 'sweeper']
      });

      const allSweepers = await this.sweeperService.findAll()

      const sweepersNotInGiveaway = allSweepers.filter(sweeper => {
        return !giveawaySweepers.some(gs => gs.sweeper.id_sweeper === sweeper.id_sweeper);
      });

      return sweepersNotInGiveaway;
    } catch (error) {
      throw new Error("Ocurrió un error al buscar los participantes del sorteo");
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
