import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './mail.service';
import { SettingsModule } from '../settings/settings.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Global()
@Module({
  imports: [
    SettingsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class NotificationsModule {}
