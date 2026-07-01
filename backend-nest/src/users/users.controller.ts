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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Controller('utilisateurs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    const user = req.user;
    const filter: Record<string, any> = {};

    // Country Filter Logic from old middleware
    if (user && user.profil === 'Admin' && user.pays) {
      filter.pays = user.pays;
    }

    return this.usersService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findByIdWithPopulate(id);
  }

  @Post()
  @RequirePermissions('CREATE_USER')
  async create(@Body() createUserDto: CreateUserDto, @Req() req: AuthRequest) {
    const user = await this.usersService.create(createUserDto, req.user);
    await this.auditLogsService.logAction(
      req,
      'CREATE_USER',
      'ADMIN',
      `User: ${user.nom}`,
      { role: user.profil },
    );
    return user;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_USER')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthRequest,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    await this.auditLogsService.logAction(
      req,
      'UPDATE_USER',
      'ADMIN',
      `User: ${user.nom}`,
      { changes: updateUserDto },
    );
    return user;
  }

  @Delete(':id')
  @RequirePermissions('DELETE_USER')
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    const user = await this.usersService.delete(id);
    await this.auditLogsService.logAction(
      req,
      'DELETE_USER',
      'ADMIN',
      `User: ${user.nom} (${user.email})`,
      { role: user.profil },
    );
    return { message: 'Utilisateur supprimé' };
  }
}
