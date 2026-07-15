import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lieu, LieuDocument } from './schemas/lieu.schema';
import { Base, BaseDocument } from '../bases/schemas/base.schema';
import { CreateLieuDto, UpdateLieuDto } from './dto/lieux.dto';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';

@Injectable()
export class LieuxService {
  constructor(
    @InjectModel(Lieu.name) private lieuModel: Model<LieuDocument>,
    @InjectModel(Base.name) private baseModel: Model<BaseDocument>, // Utilisé pour le filtrage par pays
  ) {}

  async findAll(filter: Record<string, any> = {}): Promise<Lieu[]> {
    return this.lieuModel.find(filter).populate('pays').populate('base').exec();
  }

  async findById(id: string): Promise<LieuDocument | null> {
    return this.lieuModel.findById(id).populate('pays').populate('base').exec();
  }

  async create(
    createLieuDto: CreateLieuDto,
    user: UserPayloadDto,
  ): Promise<Lieu> {
    const userRole =
      user?.profil ||
      (((user?.role as Record<string, any>)?.name as string) ?? 'Unknown');

    if (userRole !== 'SuperAdmin') {
      if (!createLieuDto.pays && user.pays) {
        createLieuDto.pays = Array.isArray(user.pays) && user.pays.length > 0 ? String(user.pays[0]) : String(user.pays);
      }
      if (!createLieuDto.base && user.base) {
        createLieuDto.base = Array.isArray(user.base) && user.base.length > 0 ? String(user.base[0]) : String(user.base);
      }
    }

    const lieu = new this.lieuModel(createLieuDto);
    return lieu.save();
  }

  async update(id: string, updateLieuDto: UpdateLieuDto): Promise<Lieu> {
    const lieu = await this.lieuModel
      .findByIdAndUpdate(id, updateLieuDto, { new: true })
      .exec();
    if (!lieu) {
      throw new NotFoundException('Lieu non trouvé');
    }
    return lieu;
  }

  async delete(id: string): Promise<Lieu> {
    const lieu = await this.lieuModel.findByIdAndDelete(id).exec();
    if (!lieu) {
      throw new NotFoundException('Lieu non trouvé');
    }
    return lieu;
  }
}
