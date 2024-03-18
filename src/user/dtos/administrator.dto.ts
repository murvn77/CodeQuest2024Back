import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdministratorDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @ApiProperty()
  readonly username: string;

  // @IsNotEmpty({ message: 'El correo es obligatorio' })
  // @IsEmail()
  // @ApiProperty()
  // readonly email: string;

  @IsNotEmpty({ message: 'El discordId es obligatorio' })
  // @IsNumber({ maxDecimalPlaces: 0 })
  // @IsPositive()
  @IsString()
  @ApiProperty()
  readonly id: string;

  @IsString()
  @ApiProperty()
  readonly avatar: string;
}

export class UpdateAdministratorDto extends PartialType(
  CreateAdministratorDto,
) {}
