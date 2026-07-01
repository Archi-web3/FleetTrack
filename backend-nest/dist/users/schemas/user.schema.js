"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = exports.UtilisateurSchema = exports.Utilisateur = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
let Utilisateur = class Utilisateur {
    nom;
    email;
    motDePasse;
    profil;
    role;
    pays;
    base;
    numeroEmploye;
    niveauValidationSecu;
    autoManageSecurity;
    prenom;
    telephone;
    permis;
    disponible;
    formationEcoConduite;
    vehiculeAttitre;
    documents;
    projet;
};
exports.Utilisateur = Utilisateur;
exports.User = Utilisateur;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Utilisateur.prototype, "nom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Utilisateur.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Utilisateur.prototype, "motDePasse", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: [
            'SuperAdmin',
            'Admin',
            'Superviseur',
            'Superviseur Sécurité',
            'Logisticien',
            'Technicien',
            'Guest',
            'Chauffeur',
        ],
        default: 'Technicien',
    }),
    __metadata("design:type", String)
], Utilisateur.prototype, "profil", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Role' }),
    __metadata("design:type", String)
], Utilisateur.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Pays' }),
    __metadata("design:type", String)
], Utilisateur.prototype, "pays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Base' }),
    __metadata("design:type", String)
], Utilisateur.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Utilisateur.prototype, "numeroEmploye", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: [1, 2, 3, 4, 5], default: 1 }),
    __metadata("design:type", Number)
], Utilisateur.prototype, "niveauValidationSecu", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Utilisateur.prototype, "autoManageSecurity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Utilisateur.prototype, "prenom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Utilisateur.prototype, "telephone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Utilisateur.prototype, "permis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Utilisateur.prototype, "disponible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Utilisateur.prototype, "formationEcoConduite", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Vehicule' }),
    __metadata("design:type", String)
], Utilisateur.prototype, "vehiculeAttitre", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            nom: String,
            url: String,
            dateAjout: { type: Date, default: Date.now },
            typeSource: { type: String, enum: ['Upload', 'Lien'], default: 'Upload' },
        },
    ]),
    __metadata("design:type", Array)
], Utilisateur.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Support', trim: true }),
    __metadata("design:type", String)
], Utilisateur.prototype, "projet", void 0);
exports.User = exports.Utilisateur = Utilisateur = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Utilisateur);
exports.UtilisateurSchema = mongoose_1.SchemaFactory.createForClass(Utilisateur);
exports.UserSchema = exports.UtilisateurSchema;
exports.UtilisateurSchema.pre('save', async function (next) {
    if (this.isModified('motDePasse')) {
        const salt = await bcrypt.genSalt(10);
        this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    }
    next();
});
exports.UtilisateurSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.motDePasse);
};
//# sourceMappingURL=user.schema.js.map