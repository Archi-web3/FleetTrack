import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WaiverService, Waiver } from '../../core/services/waiver.service';

@Component({
    selector: 'app-waiver-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule
    ],
    templateUrl: './waiver-list.html',
    styleUrls: ['./waiver-list.css']
})
export class WaiverListComponent implements OnInit {
    waivers: Waiver[] = [];
    displayedColumns: string[] = ['date', 'visitor', 'vehicle', 'signature', 'actions'];

    constructor(private waiverService: WaiverService) { }

    ngOnInit() {
        this.loadWaivers();
    }

    loadWaivers() {
        this.waiverService.getAllWaivers().subscribe({
            next: (data) => this.waivers = data,
            error: (err) => console.error('Error loading waivers', err)
        });
    }

    printWaiver(waiver: Waiver) {
        const popup = window.open('', '_blank', 'width=800,height=600');
        if (popup) {
            popup.document.write(`
                <html>
                    <head>
                        <title>Décharge - ${waiver.visitorName}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 40px; }
                            .header { text-align: center; border-bottom: 2px solid #d32f2f; padding-bottom: 20px; margin-bottom: 30px; }
                            h1 { color: #d32f2f; margin: 0; }
                            .content { line-height: 1.6; background: #fafafa; padding: 20px; border-radius: 5px; }
                            .signature-box { margin-top: 50px; text-align: right; }
                            img { border: 1px solid #ccc; max-width: 300px; }
                            .meta { font-size: 12px; color: #666; margin-top: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>ACF - Décharge de Responsabilité</h1>
                            <p>Visiteur: <strong>${waiver.visitorName}</strong></p>
                        </div>
                        <div class="content">
                            <p><strong>Date :</strong> ${new Date(waiver.signedAt).toLocaleString()}</p>
                            <p><strong>Véhicule :</strong> ${waiver.vehicleId?.immatriculation} (${waiver.vehicleId?.marque})</p>
                            <hr>
                            <p>
                                Je soussigné(e), reconnais monter à bord d'un véhicule d'Action Contre la Faim (ACF) de mon plein gré.
                                J'atteste avoir pris connaissance des risques inhérents à ce déplacement et dégage ACF de toute
                                responsabilité en cas de vol, perte d'effets personnels, accident ou incident survenant durant le trajet, sauf en cas de
                                faute lourde avérée d'ACF.
                            </p>
                            <p>
                                Je m'engage à respecter les consignes de sécurité données par le chauffeur et le personnel d'ACF.
                                Je certifie ne transporter aucune substance illicite ou dangereuse.
                            </p>
                        </div>
                        <div class="signature-box">
                            <p>Signature:</p>
                            <img src="${waiver.signatureUrl}" />
                            <p class="meta">Signé le ${new Date(waiver.signedAt).toLocaleString()}</p>
                        </div>
                        <script>window.print();</script>
                    </body>
                </html>
            `);
            popup.document.close();
        }
    }

    deleteWaiver(waiver: Waiver) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la décharge de ${waiver.visitorName} ?`)) {
            this.waiverService.deleteWaiver(waiver._id).subscribe({
                next: () => {
                    this.loadWaivers();
                },
                error: (err) => console.error('Error deleting waiver', err)
            });
        }
    }
}
