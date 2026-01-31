import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { WaiverService } from '../../core/services/waiver.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-waiver',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule,
        TranslateModule,
        RouterModule
    ],
    templateUrl: './waiver.html',
    styleUrls: ['./waiver.css']
})
export class WaiverComponent implements AfterViewInit {
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    visitorName: string = '';
    isDrawing = false;
    private ctx!: CanvasRenderingContext2D;
    currentVehicleId: string | null = null;

    constructor(
        private waiverService: WaiverService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        const user = this.authService.getCurrentUser();
        // Assuming the logged-in user (driver) is associated with a vehicle
        // Or we might need to select a vehicle if the driver manages multiple
        // For e-logbook, usually one vehicle per device/session.
        // Let's try to get it from local storage or auth service
        const vehicle = localStorage.getItem('selectedVehicle');
        if (vehicle) {
            this.currentVehicleId = JSON.parse(vehicle)._id;
        }
    }

    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;

        // Resize canvas to fit container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Mouse Events
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch Events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }

    resizeCanvas() {
        const canvas = this.canvasRef.nativeElement;
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = 200; // Fixed height for signature area
        }

        // Reset context properties after resize
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#000';
    }

    startDrawing(e: MouseEvent) {
        this.isDrawing = true;
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    draw(e: MouseEvent) {
        if (!this.isDrawing) return;
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.closePath();
    }

    clearSignature() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    submitWaiver() {
        if (!this.visitorName.trim()) {
            this.snackBar.open('Veuillez entrer le nom du visiteur', 'OK', { duration: 3000 });
            return;
        }

        if (!this.currentVehicleId) {
            this.snackBar.open('Erreur: Aucun véhicule sélectionné', 'OK', { duration: 3000 });
            return;
        }

        // Check if canvas is empty (basic check)
        const canvas = this.canvasRef.nativeElement;
        // Ideally checking pixel data, but for now assume user signed if they clicked validation

        canvas.toBlob((blob) => {
            if (blob) {
                this.waiverService.createWaiver(this.visitorName, this.currentVehicleId!, blob)
                    .subscribe({
                        next: () => {
                            this.snackBar.open('Décharge signée et enregistrée !', 'Succès', { duration: 3000 });
                            this.router.navigate(['/dashboard']);
                        },
                        error: (err) => {
                            console.error(err);
                            this.snackBar.open('Erreur lors de l\'envoi de la décharge', 'Réessayer', { duration: 3000 });
                        }
                    });
            }
        });
    }
}
