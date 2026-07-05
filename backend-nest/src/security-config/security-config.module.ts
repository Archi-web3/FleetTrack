import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityConfigController } from './security-config.controller';
import { SecurityConfigService } from './security-config.service';
import { SecurityConfig, SecurityConfigSchema } from '../mouvements/schemas/security-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecurityConfig.name, schema: SecurityConfigSchema },
    ]),
  ],
  controllers: [SecurityConfigController],
  providers: [SecurityConfigService],
  exports: [SecurityConfigService],
})
export class SecurityConfigModule {}
