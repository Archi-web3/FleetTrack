"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouvementQueryDto = exports.UserPayloadDto = exports.CreateMouvementDto = void 0;
class CreateMouvementDto {
    dateDepart;
    dateArrivee;
    stops;
    chauffeur;
    vehicule;
    type;
    demandeur;
    pays;
}
exports.CreateMouvementDto = CreateMouvementDto;
class UserPayloadDto {
    _id;
    id;
    nom;
    prenom;
    base;
    pays;
    profil;
    role;
}
exports.UserPayloadDto = UserPayloadDto;
class MouvementQueryDto {
}
exports.MouvementQueryDto = MouvementQueryDto;
//# sourceMappingURL=mouvements.dto.js.map