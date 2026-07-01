import { Module } from '@nestjs/common';
import { ChauffeursController } from './chauffeurs.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // Proxy to UsersService
  controllers: [ChauffeursController],
})
export class ChauffeursModule {}
