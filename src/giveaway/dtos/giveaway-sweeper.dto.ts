import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateGiveawaySweeperDto {
  @IsNotEmpty({ message: 'La fk de sorteo es obligatoria' })
  @IsString()
  @ApiProperty()
  readonly fk_id_giveaway: string;
  @IsNotEmpty({ message: 'La fk del sweeper es obligatoria' })
  @IsString()
  @ApiProperty()
  readonly fk_id_sweeper: string;
  @IsNotEmpty({ message: 'El estado de ganador es obligatorio' })
  @IsBoolean()
  @ApiProperty()
  readonly winner: boolean;
}

export class UpdateGiveawaySweeperDto extends PartialType(
  CreateGiveawaySweeperDto,
) {}
