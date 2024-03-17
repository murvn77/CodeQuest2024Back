import { Giveaway } from 'src/giveaway/entities/giveaway.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Administrator {
  @PrimaryGeneratedColumn('uuid')
  id_administrator: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'numeric' })
  document: number;

  @OneToMany(() => Giveaway, (giveaway) => giveaway.administrator)
  giveaway: Giveaway;
}
