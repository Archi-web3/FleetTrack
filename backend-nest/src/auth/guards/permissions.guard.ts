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

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // 1. New RBAC System Check
    if (user.role && typeof user.role !== 'string' && (user.role as any).permissions) {
      const role = user.role as { name: string; permissions: string[] };
      
      // SuperAdmin bypass
      if (role.name === 'SuperAdmin' || role.permissions.includes('ALL')) {
        return true;
      }
      
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }

      const hasPermission = requiredPermissions.some((permission) =>
        role.permissions.includes(permission),
      );

      if (hasPermission) return true;
      // Fallback to legacy check below if RBAC check failed (for transition period)
    }

    // 2. Legacy profil check
    const profil = user.profil;

    if (profil === 'SuperAdmin') {
      return true;
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No specific permissions required, just authentication
    }

    // Basic legacy mapping
    const isBasicUser = ['Demandeur', 'Chauffeur', 'Guest'].includes(profil);
    const isManager = ['Admin', 'Superviseur', 'Superviseur Sécurité', 'Technicien'].includes(profil);

    // Basic users can only do basic things
    const basicPermissions = ['VIEW_OWN_MOUVEMENTS', 'CREATE_MOUVEMENT'];
    
    for (const reqPerm of requiredPermissions) {
       if (basicPermissions.includes(reqPerm)) {
         return true; // Everyone can view own movements and create
       }
       if (isManager) {
         return true; // Managers can do almost everything for their base/country, logic in controller
       }
    }

    return false; // If not basic permission and not manager, deny
  }
}
