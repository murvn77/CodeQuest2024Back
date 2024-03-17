import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  @ApiProperty()
  readonly initial_date: Date;

  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  readonly finish_date: Date;

  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly state: boolean;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly imagen: any;

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
