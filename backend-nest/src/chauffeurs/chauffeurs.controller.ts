import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CreateUserDto, UpdateUserDto } from '../users/dto/users.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('chauffeurs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChauffeursController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll({
      profil: { $in: ['Chauffeur', 'driver'] },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findByIdWithPopulate(id);
    if (user && (user.profil === 'Chauffeur' || user.profil === 'driver')) {
      return user;
    }
    return null;
  }

  @Post()
  @RequirePermissions('CREATE_USER')
  async create(
    @Body() createChauffeurDto: CreateUserDto,
    @Req() req: AuthRequest,
  ) {
    // Dans la refonte, on exige que le frontend envoie un vrai mot de passe
    // On s'assure juste que le profil est forcé à Chauffeur
    createChauffeurDto.profil = 'Chauffeur';

    const nouveauChauffeur = await this.usersService.create(
      createChauffeurDto,
      req.user,
    );
    const responseData = nouveauChauffeur.toObject() as Record<string, any>;
    delete responseData.motDePasse;
    return responseData as Partial<UserDocument>;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_USER')
  async update(
    @Param('id') id: string,
    @Body() updateChauffeurDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateChauffeurDto);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_USER')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'Chauffeur supprimé' };
  }
}
