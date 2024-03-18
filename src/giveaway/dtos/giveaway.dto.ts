import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGiveawayDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  readonly initial_date: Date;

  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  readonly finish_date: Date;

  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsBoolean()
  @ApiProperty()
  readonly state: boolean;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  readonly imagen: any;

  @IsNotEmpty({ message: 'La cantidad de ganadores es obligatoria' })
  @IsNumber()
  @ApiProperty()
  number_winners: number

  @IsNotEmpty({ message: 'La fk del administrador es obligatoria' })
  @IsString()
  @ApiProperty()
  readonly fk_id_administrator: string;
}

export class UpdateGiveawayDto extends PartialType(CreateGiveawayDto) {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  readonly fechaIngreso: Date;
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  readonly fechaSalida: Date;
}
