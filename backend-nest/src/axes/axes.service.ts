import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Axe, AxeDocument } from './schemas/axe.schema';
import { CreateAxeDto, UpdateAxeDto } from './dto/axes.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AxesService {
  constructor(
    @InjectModel(Axe.name) private axeModel: Model<AxeDocument>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(createAxeDto: CreateAxeDto, req: any): Promise<Axe> {
    const createdAxe = new this.axeModel(createAxeDto);
    const result = await createdAxe.save();

    await this.auditLogsService.logAction(
      req as any,
      'CREATE_AXE',
      'Axe',
      result._id.toString(),
      result.toObject() as any,
    );
    return result.populate(['depart', 'arrivee', 'pays', 'base']);
  }

  async findAll(context: any): Promise<Axe[]> {
    const filter: any = {};
    if (context.paysIds && context.paysIds.length > 0) {
      filter.pays = { $in: context.paysIds };
    }
    if (context.baseIds && context.baseIds.length > 0) {
      filter.base = { $in: context.baseIds };
    }
    return this.axeModel.find(filter).populate(['depart', 'arrivee', 'pays', 'base']).exec();
  }

  async findOne(id: string): Promise<Axe> {
    const axe = await this.axeModel.findById(id).populate(['depart', 'arrivee', 'pays', 'base']).exec();
    if (!axe) {
      throw new NotFoundException(`Axe with ID ${id} not found`);
    }
    return axe;
  }

  async update(id: string, updateAxeDto: UpdateAxeDto, req: any): Promise<Axe> {
    const existingAxe = await this.axeModel
      .findByIdAndUpdate(id, updateAxeDto, { new: true })
      .exec();

    if (!existingAxe) {
      throw new NotFoundException(`Axe with ID ${id} not found`);
    }

    await this.auditLogsService.logAction(
      req as any,
      'UPDATE_AXE',
      'Axe',
      id,
      existingAxe.toObject() as any,
    );

    return existingAxe.populate(['depart', 'arrivee', 'pays', 'base']);
  }

  async delete(id: string, req: any): Promise<void> {
    const deletedAxe = await this.axeModel.findByIdAndDelete(id).exec();
    if (!deletedAxe) {
      throw new NotFoundException(`Axe with ID ${id} not found`);
    }

    await this.auditLogsService.logAction(
      req as any,
      'DELETE_AXE',
      'Axe',
      id,
      deletedAxe.toObject() as any,
    );
  }

  // Helper method for MouvementsService to find an axe between two locations
  async findAxeBetween(lieu1Id: string, lieu2Id: string): Promise<Axe | null> {
    // Check both directions
    const axe = await this.axeModel.findOne({
      actif: true,
      $or: [
        { depart: lieu1Id, arrivee: lieu2Id },
        { depart: lieu2Id, arrivee: lieu1Id },
      ]
    }).exec();
    
    return axe;
  }
}
