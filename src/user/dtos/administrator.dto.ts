import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAdministratorDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: 'El ID de Discord es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly discord_id: string;
}

export class UpdateAdministratorDto extends PartialType(
  CreateAdministratorDto,
) {}
