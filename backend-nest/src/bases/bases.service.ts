import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Base, BaseDocument } from './schemas/base.schema';
import { CreateBaseDto, UpdateBaseDto } from './dto/bases.dto';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';

@Injectable()
export class BasesService {
  constructor(@InjectModel(Base.name) private baseModel: Model<BaseDocument>) {}

  async findAll(query: Record<string, any> = {}): Promise<Base[]> {
    return this.baseModel
      .find(query)
      .populate('pays', 'nom code')
      .sort('nom')
      .exec();
  }

  async findById(id: string): Promise<BaseDocument | null> {
    return this.baseModel.findById(id).populate('pays', 'nom code').exec();
  }

  async create(
    createBaseDto: CreateBaseDto,
    user: UserPayloadDto,
  ): Promise<Base> {
    // Règle: Si c'est un Admin, on force le pays à être le sien
    const userRole =
      user?.profil ||
      (((user?.role as Record<string, any>)?.name as string) ?? 'Unknown');
    if (userRole === 'Admin' && user.pays) {
      createBaseDto.pays = user.pays;
    }

    const base = new this.baseModel(createBaseDto);
    const savedBase = await base.save();
    return savedBase.populate('pays', 'nom code');
  }

  async update(id: string, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const base = await this.baseModel
      .findByIdAndUpdate(id, updateBaseDto, { new: true })
      .populate('pays', 'nom code')
      .exec();
    if (!base) {
      throw new NotFoundException('Base non trouvée');
    }
    return base;
  }

  async delete(id: string): Promise<Base> {
    const base = await this.baseModel.findByIdAndDelete(id).exec();
    if (!base) {
      throw new NotFoundException('Base non trouvée');
    }
    return base;
  }
}
