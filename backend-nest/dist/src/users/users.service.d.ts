import { Model } from 'mongoose';
import { Utilisateur, UtilisateurDocument, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UtilisateurDocument>);
    findByEmail(email: string): Promise<UtilisateurDocument | null>;
    findByIdWithRole(id: string): Promise<UtilisateurDocument | null>;
    findByIdWithPopulate(id: string): Promise<UtilisateurDocument | null>;
    findAll(filter?: Record<string, any>): Promise<Utilisateur[]>;
    create(createUserDto: CreateUserDto, creator?: UserPayloadDto): Promise<UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    delete(id: string): Promise<UserDocument>;
}
