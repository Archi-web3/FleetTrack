import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MouvementsService } from './mouvements.service';
import { MouvementsConflictService } from './mouvements-conflict.service';
import { MouvementsSecurityService } from './mouvements-security.service';
import { Mouvement, MouvementSchema } from './schemas/mouvement.schema';
import {
  SecurityConfig,
  SecurityConfigSchema,
} from './schemas/security-config.schema';
import { Lieu, LieuSchema } from '../lieux/schemas/lieu.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mouvement.name, schema: MouvementSchema },
      { name: SecurityConfig.name, schema: SecurityConfigSchema },
      { name: Lieu.name, schema: LieuSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    MouvementsService,
    MouvementsConflictService,
    MouvementsSecurityService,
  ],
  exports: [MouvementsService],
})
export class MouvementsModule {}
