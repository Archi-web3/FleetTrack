import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Utilisateur,
  UtilisateurDocument,
  UserDocument,
} from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Utilisateur.name)
    private userModel: Model<UtilisateurDocument>,
  ) {}

  async findByEmail(email: string): Promise<UtilisateurDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByIdWithRole(id: string): Promise<UtilisateurDocument | null> {
    return this.userModel.findById(id).populate('role').exec();
  }

  async findByIdWithPopulate(id: string): Promise<UtilisateurDocument | null> {
    return this.userModel
      .findById(id)
      .populate('pays', 'nom code')
      .populate('base', 'nom')
      .exec();
  }

  async findAll(filter: Record<string, any> = {}): Promise<Utilisateur[]> {
    return this.userModel
      .find(filter)
      .populate('pays base role')
      .select('-motDePasse')
      .exec();
  }

  async create(
    createUserDto: CreateUserDto,
    creator?: UserPayloadDto,
  ): Promise<UserDocument> {
    const creatorProfil = creator ? creator.profil : 'SuperAdmin';
    const targetProfil = createUserDto.profil;

    // RÈGLE 1 : Un Admin ne peut créer que des sous-profils
    if (creatorProfil === 'Admin') {
      if (targetProfil === 'Admin' || targetProfil === 'SuperAdmin') {
        throw new BadRequestException(
          "Un Admin ne peut pas créer d'autres Admins.",
        );
      }
      // RÈGLE 2 : Un Admin force le pays de l'utilisateur créé à être le sien
      createUserDto.pays = creator.pays;
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-motDePasse')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`Cannot find user`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`Cannot find user`);
    }
    return user;
  }
}
