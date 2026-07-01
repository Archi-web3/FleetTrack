import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RolesService.name);

  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async onApplicationBootstrap() {
    this.logger.log('Vérification et Initialisation des Rôles Système...');
    await this.seedSystemRoles();
  }

  private async seedSystemRoles() {
    const systemRoles = [
      {
        name: 'SuperAdmin',
        description:
          'Accès total à toutes les fonctionnalités et paramètres du système.',
        permissions: ['ALL'], // 'ALL' est un bypass dans le guard
        isSystemRole: true,
      },
      {
        name: 'Admin',
        description:
          'Administrateur de base/pays. Gestion de la flotte et des utilisateurs locaux.',
        permissions: [
          'CREATE_USER',
          'UPDATE_USER',
          'DELETE_USER',
          'CREATE_VEHICLE',
          'UPDATE_VEHICLE',
          'DELETE_VEHICLE',
          'CREATE_MOUVEMENT',
          'VALIDATE_MOUVEMENT',
          'UPDATE_MOUVEMENT',
          'CREATE_LOCATION',
          'UPDATE_LOCATION',
        ],
        isSystemRole: true,
      },
      {
        name: 'Superviseur',
        description:
          'Superviseur logistique. Validation des mouvements et entretiens.',
        permissions: [
          'CREATE_MOUVEMENT',
          'VALIDATE_MOUVEMENT',
          'UPDATE_MOUVEMENT',
          'CREATE_LOCATION',
        ],
        isSystemRole: true,
      },
      {
        name: 'Chauffeur',
        description:
          'Conducteur. Accès restreint au logbook et missions assignées.',
        permissions: ['VIEW_OWN_MOUVEMENTS', 'UPDATE_OWN_MOUVEMENTS_LOGBOOK'],
        isSystemRole: true,
      },
      {
        name: 'Demandeur',
        description: 'Utilisateur standard pouvant demander des mouvements.',
        permissions: ['CREATE_MOUVEMENT', 'VIEW_OWN_MOUVEMENTS'],
        isSystemRole: true,
      },
    ];

    for (const roleData of systemRoles) {
      const existingRole = await this.roleModel
        .findOne({ name: roleData.name })
        .exec();
      if (!existingRole) {
        const newRole = new this.roleModel(roleData);
        await newRole.save();
        this.logger.log(`✅ Rôle Système créé : ${roleData.name}`);
      } else {
        // Optionnel : Mettre à jour les permissions si elles ont changé (hard-sync)
        // Pour l'instant on laisse tel quel pour permettre la modification via l'UI
      }
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).exec();
  }
}
