import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdministratorDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: 'El discordId es obligatorio' })
  // @IsNumber({ maxDecimalPlaces: 0 })
  // @IsPositive()
  @IsString()
  @ApiProperty()
  readonly discord_id: string;

  @IsString()
  @ApiProperty()
  readonly avatar: string;
}

export class UpdateAdministratorDto extends PartialType(
  CreateAdministratorDto,
) {}
