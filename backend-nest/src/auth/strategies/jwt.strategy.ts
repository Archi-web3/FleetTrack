import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromHeader('x-auth-token'),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'super_secret_dev_key_12345',
    });
  }

  async validate(payload: {
    sub?: string;
    userId?: string;
    utilisateur?: { id: string };
  }) {
    // payload.sub is usually the user ID
    const id = payload.sub || payload.userId || payload.utilisateur?.id;
    if (!id) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findByIdWithRole(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Return full user object to the Request
  }
}
