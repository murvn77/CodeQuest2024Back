import { Giveaway } from 'src/giveaway/entities/giveaway.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Administrator {
  @PrimaryGeneratedColumn('uuid')
  id_administrator: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  // @Column({ type: 'varchar', length: 40 })
  // email: string;

  @Column({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  avatar: string;

  @OneToMany(() => Giveaway, (giveaway) => giveaway.administrator)
  giveaway: Giveaway;
}
