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

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail()
  @ApiProperty()
  readonly email: string;
}

export class UpdateSweeperDto extends PartialType(CreateSweeperDto) {}
