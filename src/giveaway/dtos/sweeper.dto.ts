import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSweeperDto {
  @IsNotEmpty({ message: 'El ID de Discord es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly id_discord: string;

  @IsNotEmpty({ message: 'El username es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsNotEmpty({ message: 'El avatar es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly avatar: string;
}

export class UpdateSweeperDto extends PartialType(CreateSweeperDto) {}
