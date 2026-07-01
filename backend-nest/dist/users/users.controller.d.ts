import { UsersService } from './users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly auditLogsService;
    constructor(usersService: UsersService, auditLogsService: AuditLogsService);
    findAll(req: AuthRequest): Promise<import("./schemas/user.schema").Utilisateur[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    create(createUserDto: CreateUserDto, req: AuthRequest): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: AuthRequest): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    delete(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
