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
  Headers,
  Query,
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
  async findAll(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays?: string,
    @Headers('x-selected-base') headerBase?: string,
    @Query('scope') scope?: string,
  ) {
    const user = req.user;
    const filter: Record<string, any> = {};

    const userRole = user?.profil || (user?.role as Record<string, unknown>)?.['name'];

    // Check if we should enforce filtering by base or pays
    if (userRole === 'SuperAdmin' || userRole === 'Super Admin') {
      if (headerPays && headerPays !== 'all' && headerPays !== 'null' && headerPays !== 'undefined') {
        filter.pays = headerPays;
      }
      if (headerBase && headerBase !== 'all' && headerBase !== 'null' && headerBase !== 'undefined' && scope !== 'pays') {
        filter.base = headerBase;
      }
    } else if (user) {
      if (headerBase && headerBase !== 'all' && headerBase !== 'null' && headerBase !== 'undefined' && scope !== 'pays') {
        // If a specific base is selected, show users of this base
        filter.base = headerBase;
      } else if (user.pays) {
        // Otherwise, if no base is selected (or user clicked "Show all in country"), show users from their country
        const userPays = Array.isArray(user.pays) ? user.pays : [user.pays];
        filter.pays = { $in: userPays };
      }
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
