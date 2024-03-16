import { Module } from '@nestjs/common';
import { AdministratorController } from './controllers/administrator.controller';
import { AdministratorService } from './services/administrator.service';

@Module({
  controllers: [AdministratorController],
  providers: [AdministratorService]
})
export class UserModule {}
