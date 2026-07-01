import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginPayloadDto } from './dto/auth.dto';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginPayloadDto, @Req() req: AuthRequest) {
    const user = await this.authService.validateUser(
      body.email,
      body.motDePasse,
      req,
    );
    // On met le user dans la requête pour que l'audit log puisse l'utiliser plus tard
    req.user = user as unknown;
    return this.authService.login(user, req);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
