import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Request } from 'express';
import { RegisterDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    private auditLogsService;
    constructor(usersService: UsersService, jwtService: JwtService, auditLogsService: AuditLogsService);
    validateUser(email: string, pass: string, req: Request): Promise<Partial<UserDocument>>;
    login(user: Partial<UserDocument>, req: Request): Promise<{
        token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            id: string;
            nom: string;
            email: string;
            profil: string;
            pays: {
                id: import("mongoose").Types.ObjectId;
                nom: string;
                code: string;
            };
            base: {
                id: import("mongoose").Types.ObjectId;
                nom: string;
            };
        };
        message: string;
    }>;
    register(createUserDto: RegisterDto): Promise<{
        token: string;
        message: string;
    }>;
}
