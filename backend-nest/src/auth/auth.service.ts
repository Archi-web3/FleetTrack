import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Request } from 'express';
import { RegisterDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { PaysDocument } from '../pays/schemas/pays.schema';
import { BaseDocument } from '../bases/schemas/base.schema';

type UserWithPassword = UserDocument & {
  comparePassword: (pass: string) => Promise<boolean>;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditLogsService: AuditLogsService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
    req: Request,
  ): Promise<Partial<UserDocument>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      await this.auditLogsService.logAction(
        req,
        'LOGIN_FAILED',
        'AUTH',
        `Email: ${email}`,
        { reason: 'User not found' },
      );
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isMatch = await (user as UserWithPassword).comparePassword(pass);
    if (!isMatch) {
      await this.auditLogsService.logAction(
        req,
        'LOGIN_FAILED',
        'AUTH',
        `Email: ${email}`,
        { reason: 'Invalid password' },
      );
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Return user without password
    const result = user.toObject() as Record<string, any>;
    delete result.motDePasse;
    return result;
  }

  async login(user: Partial<UserDocument>, req: Request) {
    // Populate the relationships exactly like the old backend for compatibility
    if (!user._id) throw new UnauthorizedException('Utilisateur introuvable');
    const fullUser = await this.usersService.findByIdWithPopulate(
      user._id.toString(),
    );

    if (!fullUser) throw new UnauthorizedException('Utilisateur introuvable');

    // Le payload doit être exactement comme dans l'ancien backend pour la rétrocompatibilité
    const payload = {
      utilisateur: {
        id: fullUser._id.toString(),
        nom: fullUser.nom,
        profil: fullUser.profil, // Backward compatibility
        pays: fullUser.pays
          ? {
              id: (fullUser.pays as unknown as PaysDocument)._id,
              nom: (fullUser.pays as unknown as PaysDocument).nom,
              code: (fullUser.pays as unknown as PaysDocument).code,
            }
          : null,
        base: fullUser.base
          ? {
              id: (fullUser.base as unknown as BaseDocument)._id,
              nom: (fullUser.base as unknown as BaseDocument).nom,
            }
          : null,
      },
    };

    await this.auditLogsService.logAction(
      req,
      'LOGIN_SUCCESS',
      'AUTH',
      `User: ${fullUser.nom}`,
      { email: fullUser.email, role: fullUser.profil },
    );

    return {
      token: this.jwtService.sign(payload),
      user: {
        _id: fullUser._id,
        id: fullUser._id.toString(),
        nom: fullUser.nom,
        email: fullUser.email,
        profil: fullUser.profil,
        pays: payload.utilisateur.pays,
        base: payload.utilisateur.base,
      },
      message: 'Connexion réussie',
    };
  }

  async register(createUserDto: RegisterDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException("L'utilisateur existe déjà");
    }

    const newUser = await this.usersService.create(createUserDto);

    const payload = {
      utilisateur: {
        id: newUser._id.toString(),
        nom: newUser.nom,
        profil: newUser.profil,
      },
    };

    return {
      token: this.jwtService.sign(payload),
      message: 'Utilisateur enregistré avec succès',
    };
  }
}
