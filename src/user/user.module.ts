import { Module } from '@nestjs/common';
import { AdministratorController } from './controllers/administrator.controller';
import { AdministratorService } from './services/administrator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { GiveawayModule } from 'src/giveaway/giveaway.module';

@Module({
  imports: [TypeOrmModule.forFeature([Administrator]), GiveawayModule],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class UserModule {}
