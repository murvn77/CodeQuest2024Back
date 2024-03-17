import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sweeper } from './sweeper.entity';
import { Giveaway } from './giveaway.entity';

@Entity()
export class GiveawaySweeper {
  @PrimaryGeneratedColumn('uuid')
  id_giveawaySweeper: string;

  @ManyToOne(() => Giveaway, (giveaway) => giveaway.giveawaySweeper)
  @JoinColumn({ name: 'fk_id_giveaway' })
  giveaway: Giveaway;

  @ManyToOne(() => Sweeper, (sweeper) => sweeper.giveawaySweeper)
  @JoinColumn({ name: 'fk_id_sweeper' })
  sweeper: Sweeper;

  @Column({ type: 'boolean' })
  winner: boolean;
}
