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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const settings_service_1 = require("../settings/settings.service");
let MailService = MailService_1 = class MailService {
    settingsService;
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    isSimulationMode = false;
    constructor(settingsService) {
        this.settingsService = settingsService;
        this.initTransporter();
    }
    initTransporter() {
        const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;
        if (isSmtpConfigured) {
            this.logger.log('📧 SMTP configuration found. Initializing Nodemailer...');
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            this.isSimulationMode = false;
        }
        else {
            this.logger.warn('⚠️ SMTP not configured (Missing SMTP_HOST or SMTP_USER). Using SIMULATION MODE (Logs only).');
            this.isSimulationMode = true;
        }
    }
    async isNotificationEnabled(notificationType) {
        const mailSettings = (await this.settingsService.getSetting('mailNotifications'));
        if (!mailSettings)
            return true;
        if (mailSettings[notificationType] === false) {
            this.logger.log(`🔕 Notification ${notificationType} is disabled in settings. Skipping email.`);
            return false;
        }
        return true;
    }
    async sendMail(to, subject, htmlContent) {
        if (this.isSimulationMode) {
            this.logger.log('---------------------------------------------------');
            this.logger.log('📧 [SIMULATION] Sending Email');
            this.logger.log(`To: ${to}`);
            this.logger.log(`Subject: ${subject}`);
            this.logger.log('---------------------------------------------------');
            return { messageId: 'simulation-' + Date.now() };
        }
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM ||
                    '"FleetTrack Notification" <no-reply@fleettrack.acf>',
                to,
                subject,
                html: htmlContent,
                text: htmlContent.replace(/<[^>]*>?/gm, ''),
            };
            const info = (await this.transporter.sendMail(mailOptions));
            this.logger.log(`✅ Email sent: ${info.messageId}`);
            return info;
        }
        catch (e) {
            const err = e;
            this.logger.error('❌ Error sending email:', err.stack);
            return null;
        }
    }
    async sendValidationRequest(to, movement) {
        const isEnabled = await this.isNotificationEnabled('validationRequest');
        if (!isEnabled)
            return;
        const destination = this.getLastDestination(movement);
        const subject = `[FleetTrack] 🛡️ Validation Requise : ${destination}`;
        const folder = movement.projetsPassagers && movement.projetsPassagers.length > 0
            ? movement.projetsPassagers.join(', ')
            : movement.projet || 'N/A';
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ccc; border-radius: 5px; padding: 20px;">
        <h2 style="color: #005FB6;">Demande de Validation</h2>
        <p>Un mouvement nécessite votre approbation.</p>
        <ul>
          <li><strong>Demandeur:</strong> ${movement.demandeur ? movement.demandeur.prenom + ' ' + movement.demandeur.nom : 'Inconnu'}</li>
          <li><strong>Projet:</strong> ${folder}</li>
          <li><strong>Destination:</strong> ${destination}</li>
        </ul>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/validation" 
           style="background-color: #005FB6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">
           Accéder à la Validation
        </a>
      </div>
    `;
        await this.sendMail(to, subject, html);
    }
    async sendStatusUpdate(to, movement, status, reason = '') {
        const isEnabled = await this.isNotificationEnabled('statusUpdate');
        if (!isEnabled)
            return;
        const isRefused = status === 'refusé';
        const color = isRefused ? '#D32F2F' : '#2E7D32';
        const destination = this.getLastDestination(movement);
        const subject = `[FleetTrack] ℹ️ Votre mouvement est ${status.toUpperCase()}`;
        let reasonHtml = '';
        if (reason && isRefused) {
            reasonHtml = `<p style="color: #b71c1c;"><strong>Motif du refus :</strong> ${reason}</p>`;
        }
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ccc; border-radius: 5px; padding: 20px;">
        <h2 style="color: ${color};">Statut de la demande : ${status.toUpperCase()}</h2>
        <p>Votre demande de mouvement vers <strong>${destination}</strong> a été mise à jour.</p>
        ${reasonHtml}
        <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/mes-mouvements" 
           style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">
           Voir ma demande
        </a>
      </div>
    `;
        await this.sendMail(to, subject, html);
    }
    getLastDestination(movement) {
        if (movement.stops && movement.stops.length > 0) {
            const lastStop = movement.stops[movement.stops.length - 1];
            if (lastStop.lieu && lastStop.lieu.nom) {
                return lastStop.lieu.nom;
            }
        }
        return 'Destination inconnue';
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], MailService);
//# sourceMappingURL=mail.service.js.map