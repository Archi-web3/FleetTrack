/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pays, PaysDocument } from './schemas/pays.schema';

@Injectable()
export class PaysService {
  constructor(@InjectModel(Pays.name) private paysModel: Model<PaysDocument>) {}

  async findAll(): Promise<Pays[]> {
    return this.paysModel.find().sort('nom').exec();
  }

  async findById(id: string): Promise<PaysDocument | null> {
    return this.paysModel.findById(id).exec();
  }

  async create(createPaysDto: any): Promise<Pays> {
    const pays = new this.paysModel(createPaysDto);
    return pays.save();
  }

  async update(id: string, updatePaysDto: any): Promise<Pays> {
    const pays = await this.paysModel
      .findByIdAndUpdate(id, updatePaysDto, { new: true })
      .exec();
    if (!pays) {
      throw new NotFoundException('Pays non trouvé');
    }
    return pays;
  }

  async delete(id: string): Promise<Pays> {
    const pays = await this.paysModel.findByIdAndDelete(id).exec();
    if (!pays) {
      throw new NotFoundException('Pays non trouvé');
    }
    return pays;
  }
}
