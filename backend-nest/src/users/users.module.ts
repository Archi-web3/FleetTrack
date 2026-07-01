import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Utilisateur, UtilisateurSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Utilisateur.name, schema: UtilisateurSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
