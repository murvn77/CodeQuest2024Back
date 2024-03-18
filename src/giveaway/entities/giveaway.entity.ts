import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GiveawaySweeper } from './giveaway-sweeper.entity';
import { Administrator } from 'src/user/entities/administrator.entity';

@Entity()
export class Giveaway {
  @PrimaryGeneratedColumn('uuid')
  id_giveaway: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'date' })
  initial_date: Date;

  @Column({ type: 'date' })
  finish_date: Date;

  @Column({ type: 'boolean' })
  state: boolean;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'numeric' })
  number_winners: number;

  @OneToMany(
    () => GiveawaySweeper,
    (giveawaySweeper) => giveawaySweeper.giveaway,
  )
  giveawaySweeper: GiveawaySweeper[];

  @ManyToOne(() => Administrator, (administrator) => administrator.giveaway)
  @JoinColumn({ name: 'fk_id_administrator' })
  administrator: Administrator;
}
