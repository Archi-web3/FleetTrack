import { UsersService } from '../users/users.service';
import { CreateUserDto, UpdateUserDto } from '../users/dto/users.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class ChauffeursController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("../users/schemas/user.schema").Utilisateur[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    create(createChauffeurDto: CreateUserDto, req: AuthRequest): Promise<Partial<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>>;
    update(id: string, updateChauffeurDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
