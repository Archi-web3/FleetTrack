import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { AuthRequest } from '../../analytics/analytics.controller';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    // Check if user exists and has a role populated
    if (
      !user ||
      !user.role ||
      typeof user.role === 'string' ||
      !(user.role as Record<string, any>).permissions
    ) {
      return false;
    }

    const role = user.role as { name: string; permissions: string[] };

    // If SuperAdmin bypass
    if (role.name === 'SuperAdmin') {
      return true;
    }

    return requiredPermissions.some((permission) =>
      role.permissions.includes(permission),
    );
  }
}
