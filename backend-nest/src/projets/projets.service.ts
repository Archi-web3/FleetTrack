import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projet, ProjetDocument } from './schemas/projet.schema';
import { CreateProjetDto, UpdateProjetDto } from './dto/projet.dto';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectModel(Projet.name) private projetModel: Model<ProjetDocument>,
  ) {}

  async findAll(query: Record<string, any> = {}): Promise<Projet[]> {
    return this.projetModel.find(query).sort({ nom: 1 }).exec();
  }

  async findById(id: string): Promise<ProjetDocument | null> {
    return this.projetModel.findById(id).exec();
  }

  async create(createProjetDto: CreateProjetDto): Promise<Projet> {
    const existant = await this.projetModel
      .findOne({ nom: createProjetDto.nom })
      .exec();
    if (existant) {
      throw new BadRequestException('Un projet avec ce nom existe déjà');
    }

    const projet = new this.projetModel(createProjetDto);
    return projet.save();
  }

  async update(id: string, updateProjetDto: UpdateProjetDto): Promise<Projet> {
    const projet = await this.projetModel.findById(id).exec();
    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (updateProjetDto.nom && updateProjetDto.nom !== projet.nom) {
      const existant = await this.projetModel
        .findOne({ nom: updateProjetDto.nom, _id: { $ne: id } })
        .exec();
      if (existant) {
        throw new BadRequestException('Un projet avec ce nom existe déjà');
      }
    }

    const updated = await this.projetModel
      .findByIdAndUpdate(id, updateProjetDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Projet non trouvé lors de la mise à jour');
    }
    return updated;
  }

  async delete(id: string): Promise<Projet> {
    const projet = await this.projetModel.findByIdAndDelete(id).exec();
    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }
    return projet;
  }
}
