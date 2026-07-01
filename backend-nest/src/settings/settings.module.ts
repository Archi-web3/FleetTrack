import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { Setting, SettingSchema } from './schemas/setting.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
  ],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
