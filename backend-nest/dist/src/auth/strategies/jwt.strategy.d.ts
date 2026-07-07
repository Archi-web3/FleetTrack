import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: {
        sub?: string;
        userId?: string;
        utilisateur?: {
            id: string;
        };
    }): Promise<import("mongoose").Document<unknown, {}, import("../../users/schemas/user.schema").Utilisateur, {}, import("mongoose").DefaultSchemaOptions> & import("../../users/schemas/user.schema").Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
export {};
