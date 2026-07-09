import { AuthService } from './auth.service';
import { RegisterDto, LoginPayloadDto } from './dto/auth.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginPayloadDto, req: AuthRequest): Promise<{
        token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            id: string;
            nom: string;
            email: string;
            profil: string;
            pays: {
                id: any;
                nom: any;
                code: any;
            }[];
            base: {
                id: any;
                nom: any;
            }[];
        };
        message: string;
    }>;
    register(body: RegisterDto): Promise<{
        token: string;
        message: string;
    }>;
}
