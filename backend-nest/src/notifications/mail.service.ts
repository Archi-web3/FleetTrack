import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

export interface MovementContext {
  demandeur?: {
    nom: string;
    prenom: string;
  };
  projet?: string;
  projetsPassagers?: string[];
  stops?: Array<{
    lieu?: {
      nom?: string;
    };
  }>;
  [key: string]: any;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private isSimulationMode = false;

  constructor(
    private settingsService: SettingsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.initTransporter();
  }

  private initTransporter() {
    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;

    if (isSmtpConfigured) {
      this.logger.log(
        '📧 SMTP configuration found. Initializing Nodemailer...',
      );
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
    } else {
      this.logger.warn(
        '⚠️ SMTP not configured (Missing SMTP_HOST or SMTP_USER). Using SIMULATION MODE (Logs only).',
      );
      this.isSimulationMode = true;
    }
  }

  /**
   * Checks if a specific notification type is enabled in the global settings.
   */
  private async isNotificationEnabled(
    notificationType: string,
  ): Promise<boolean> {
    const mailSettings = (await this.settingsService.getSetting(
      'mailNotifications',
    )) as Record<string, any>;
    // Si aucun réglage n'existe, on active par défaut pour ne pas casser l'existant
    if (!mailSettings) return true;

    // On vérifie le type spécifique, s'il est explicitement à false on bloque
    if (mailSettings[notificationType] === false) {
      this.logger.log(
        `🔕 Notification ${notificationType} is disabled in settings. Skipping email.`,
      );
      return false;
    }
    return true;
  }

  async sendMail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<Record<string, any> | null> {
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
        from:
          process.env.SMTP_FROM ||
          '"FleetTrack Notification" <no-reply@fleettrack.acf>',
        to,
        subject,
        html: htmlContent,
        text: htmlContent.replace(/<[^>]*>?/gm, ''), // Fallback texte pur
      };

      const info = (await this.transporter.sendMail(mailOptions)) as Record<
        string,
        any
      >;
      this.logger.log(`✅ Email sent: ${info.messageId}`);
      return info;
    } catch (e) {
      const err = e as Error;
      this.logger.error('❌ Error sending email:', err.stack);
      return null;
    }
  }

  /**
   * Envoi d'un email pour requérir une validation (Sécurité ou Logistique)
   */
  async sendValidationRequest(
    to: string,
    movement: MovementContext,
  ): Promise<void> {
    const isEnabled = await this.isNotificationEnabled('validationRequest');
    if (!isEnabled) return;

    const destination = this.getLastDestination(movement);
    const subject = `[FleetTrack] 🛡️ Validation Requise : ${destination}`;
    const folder =
      movement.projetsPassagers && movement.projetsPassagers.length > 0
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
        <a href="${process.env.FRONTEND_URL || 'https://fleettrack.vercel.app'}/validation" 
           style="background-color: #005FB6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">
           Accéder à la Validation
        </a>
      </div>
    `;

    await this.sendMail(to, subject, html);
  }

  /**
   * Envoi d'un email pour informer du statut (Validé / Refusé)
   */
  async sendStatusUpdate(
    to: string,
    movement: MovementContext,
    status: string,
    reason = '',
  ): Promise<void> {
    const isEnabled = await this.isNotificationEnabled('statusUpdate');
    if (!isEnabled) return;

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
        <a href="${process.env.FRONTEND_URL || 'https://fleettrack.vercel.app'}/mes-mouvements" 
           style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">
           Voir ma demande
        </a>
      </div>
    `;

    await this.sendMail(to, subject, html);
  }

  /**
   * Envoi d'un email basé sur les templates personnalisés (base, pays ou global)
   */
  async sendTemplateEmail(
    templateId: string,
    movement: MovementContext,
    defaultEmails: string[],
  ): Promise<void> {
    const isEnabled = await this.isNotificationEnabled(templateId);
    if (!isEnabled) return;

    // Chercher le template dans settings
    let emailSettings = null;
    let template = null;
    
    // Essayer de trouver le template de la Base d'abord
    if (movement.base) {
      emailSettings = await this.settingsService.getSetting(`emailSettings_base_${movement.base.toString()}`) as any[];
      template = emailSettings?.find((t) => t.id === templateId);
    }
    // Sinon le template du Pays
    if (!template && movement.pays) {
      emailSettings = await this.settingsService.getSetting(`emailSettings_pays_${movement.pays.toString()}`) as any[];
      template = emailSettings?.find((t) => t.id === templateId);
    }
    // Sinon le global
    if (!template) {
      emailSettings = await this.settingsService.getSetting('emailSettings_global') as any[];
      template = emailSettings?.find((t) => t.id === templateId);
    }

    // Si on a un template, et qu'il demande de bypasser la matrice
    let recipients = [...defaultEmails];
    if (template && template.useMatrixRecipients === false) {
       // Chercher les emails des profils/users configurés
       recipients = [];
       const queryOr = [];
       if (template.recipientProfiles && template.recipientProfiles.length > 0) {
         queryOr.push({ profil: { $in: template.recipientProfiles } });
       }
       if (template.recipientUsers && template.recipientUsers.length > 0) {
         queryOr.push({ _id: { $in: template.recipientUsers } });
       }
       
       if (queryOr.length > 0) {
         const users = await this.userModel.find({ $or: queryOr }).exec();
         users.forEach(u => {
           if (u.email && !recipients.includes(u.email)) {
             recipients.push(u.email);
           }
         });
       }
    }

    if (recipients.length === 0) {
       this.logger.warn(`Aucun destinataire trouvé pour l'email template: ${templateId}`);
       return;
    }

    if (template && template.body && template.subject) {
       // Remplacer les variables
       const demandeurName = movement.demandeur ? (movement.demandeur.prenom + ' ' + movement.demandeur.nom) : 'Inconnu';
       const link = `${process.env.FRONTEND_URL || 'https://fleettrack.vercel.app'}`;
       
       let subject = template.subject.replace(/{{movementId}}/g, movement.reference || movement._id?.toString().slice(-6));
       let body = template.body
         .replace(/{{user}}/g, demandeurName)
         .replace(/{{movementId}}/g, movement.reference || movement._id?.toString().slice(-6))
         .replace(/{{link}}/g, link)
         .replace(/\\n/g, '<br/>');

       const html = `
         <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ccc; border-radius: 5px; padding: 20px;">
           <div style="text-align: center; margin-bottom: 20px;">
             <h2 style="color: #005FB6; margin: 0;">FleetTrack</h2>
           </div>
           <div style="color: #333; line-height: 1.6;">
             ${body}
           </div>
           <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
           <div style="font-size: 12px; color: #999; text-align: center;">
             Cet email est généré automatiquement. Merci de ne pas y répondre.
           </div>
         </div>
       `;

       for (const email of recipients) {
         await this.sendMail(email, subject, html);
       }
    } else {
       // Fallback
       if (templateId === 'req_created' || templateId === 'log_validated' || templateId === 'sec_validated') {
         for (const email of recipients) {
           await this.sendValidationRequest(email, movement);
         }
       }
    }
  }

  private getLastDestination(movement: MovementContext): string {
    if (movement.stops && movement.stops.length > 0) {
      const lastStop = movement.stops[movement.stops.length - 1];
      if (lastStop.lieu && lastStop.lieu.nom) {
        return lastStop.lieu.nom;
      }
    }
    return 'Destination inconnue';
  }
}
