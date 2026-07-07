"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTasksDto = exports.CompleteServiceDto = exports.ValidateTaskDto = exports.MaintenanceConfigDto = void 0;
class MaintenanceConfigDto {
    typeVehicule;
    conditionsRoute;
    intervalleService;
    intervalleVidange;
    qualiteCarburant;
    actif;
}
exports.MaintenanceConfigDto = MaintenanceConfigDto;
class ValidateTaskDto {
    checklistId;
    tacheId;
    validee;
    commentaire;
}
exports.ValidateTaskDto = ValidateTaskDto;
class CompleteServiceDto {
    serviceId;
    signature;
}
exports.CompleteServiceDto = CompleteServiceDto;
class UpdateTasksDto {
    taches;
}
exports.UpdateTasksDto = UpdateTasksDto;
//# sourceMappingURL=maintenance.dto.js.map