import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { RoleDocument } from './schemas/role.schema';
export declare class RolesService implements OnApplicationBootstrap {
    private roleModel;
    private readonly logger;
    constructor(roleModel: Model<RoleDocument>);
    onApplicationBootstrap(): Promise<void>;
    private seedSystemRoles;
    findAll(): Promise<RoleDocument[]>;
    findByName(name: string): Promise<RoleDocument | null>;
    migrateExistingUsers(): Promise<{
        message: string;
        totalUnmigrated: number;
    }>;
}
