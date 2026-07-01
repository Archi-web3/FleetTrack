import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicule, VehiculeDocument } from './schemas/vehicule.schema';
import { MaintenanceAutomationService } from '../maintenance/maintenance-automation.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicles.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicule.name) private vehiculeModel: Model<VehiculeDocument>,
    @Inject(forwardRef(() => MaintenanceAutomationService))
    private maintenanceAutomationService: MaintenanceAutomationService,
  ) {}

  async findAll(
    user: import('../mouvements/dto/mouvements.dto').UserPayloadDto,
    countryFilter: Record<string, any>,
  ): Promise<Vehicule[]> {
    const query: Record<string, any> = {
      ...countryFilter,
    };
    if (user && user.base) {
      query.base =
        typeof user.base === 'object' && user.base !== null
          ? (user.base as { _id?: string })._id
          : user.base;
    }
    return this.vehiculeModel
      .find(query)
      .populate('base', 'nom code')
      .populate('pays', 'nom code')
      .populate('assignedDriverId', 'nom prenom')
      .exec();
  }

  async findById(id: string): Promise<VehiculeDocument | null> {
    return this.vehiculeModel
      .findById(id)
      .populate('assignedDriverId', 'nom prenom')
      .exec();
  }

  async create(createVehiculeDto: CreateVehicleDto): Promise<any> {
    if (
      createVehiculeDto.kilometrageInitial &&
      !createVehiculeDto.kilometrage
    ) {
      createVehiculeDto.kilometrage = createVehiculeDto.kilometrageInitial;
    }

    const vehicule = new this.vehiculeModel(createVehiculeDto);
    const nouveauVehicule = await vehicule.save();

    try {
      await this.maintenanceAutomationService.generateServiceSchedules(
        nouveauVehicule._id.toString(),
        nouveauVehicule.kilometrage,
      );
    } catch (e: any) {
      const err = e as Error;
      console.error('Erreur init maintenance:', err);
    }

    return nouveauVehicule;
  }

  async update(id: string, updateVehiculeDto: UpdateVehicleDto): Promise<any> {
    const vehicule = await this.vehiculeModel.findById(id).exec();
    if (!vehicule) {
      throw new NotFoundException('Cannot find vehicle');
    }

    const oldKilometrage = vehicule.kilometrage;
    const oldInitialKm = vehicule.kilometrageInitial || 0;

    Object.assign(vehicule, updateVehiculeDto);

    const initialKmHasChanged =
      updateVehiculeDto.kilometrageInitial &&
      updateVehiculeDto.kilometrageInitial !== oldInitialKm;
    const kmNotExplicitlySet =
      !updateVehiculeDto.kilometrage ||
      updateVehiculeDto.kilometrage === oldKilometrage;

    if (initialKmHasChanged && kmNotExplicitlySet) {
      vehicule.kilometrage = vehicule.kilometrageInitial;
    }

    if (
      vehicule.kilometrageInitial &&
      vehicule.kilometrage < vehicule.kilometrageInitial
    ) {
      vehicule.kilometrage = vehicule.kilometrageInitial;
    }

    const vehiculeMisAJour = await vehicule.save();

    const kmHasChanged =
      updateVehiculeDto.kilometrage &&
      updateVehiculeDto.kilometrage !== oldKilometrage;

    if (kmHasChanged || initialKmHasChanged) {
      try {
        const createdServices =
          await this.maintenanceAutomationService.generateServiceSchedules(
            vehiculeMisAJour._id.toString(),
            vehiculeMisAJour.kilometrage,
          );
        await this.maintenanceAutomationService.updateServiceStatuses(
          vehiculeMisAJour._id.toString(),
          vehiculeMisAJour.kilometrage,
        );
        return {
          vehicule: vehiculeMisAJour,
          servicesGeneres: createdServices.length,
          services: createdServices,
        };
      } catch (e: any) {
        const err = e as Error;
        console.error('Erreur génération maintenance:', err);
        return {
          vehicule: vehiculeMisAJour,
          maintenanceWarning: err.message,
        };
      }
    }

    return vehiculeMisAJour;
  }

  async delete(id: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeModel.findByIdAndDelete(id).exec();
    if (!vehicule) {
      throw new NotFoundException('Cannot find vehicle');
    }
    return vehicule;
  }
}
