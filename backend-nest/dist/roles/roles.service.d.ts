import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
export declare class RolesService implements OnApplicationBootstrap {
    private roleModel;
    private readonly logger;
    constructor(roleModel: Model<RoleDocument>);
    onApplicationBootstrap(): Promise<void>;
    private seedSystemRoles;
    findAll(): Promise<Role[]>;
    findByName(name: string): Promise<RoleDocument | null>;
}
