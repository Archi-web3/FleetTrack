"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPayloadDto = exports.RegisterDto = void 0;
class RegisterDto {
    email;
    nom;
    prenom;
    motDePasse;
    profil;
    pays;
    base;
}
exports.RegisterDto = RegisterDto;
class LoginPayloadDto {
    email;
    motDePasse;
}
exports.LoginPayloadDto = LoginPayloadDto;
//# sourceMappingURL=auth.dto.js.map