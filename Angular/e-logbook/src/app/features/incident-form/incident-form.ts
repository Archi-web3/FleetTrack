import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OfflineService, Incident } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';
import { PhotoService, Photo } from '../../core/services/photo.service';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './incident-form.html',
  styleUrls: ['./incident-form.scss']
})
export class IncidentFormComponent {
  incidentType: string = 'Panne';
  severity: string = 'Faible';
  description: string = '';
  cost: number | undefined;
  photos: Photo[] = []; // NOUVEAU: Tableau de photos

  vehicleId: string = '';

  // NOUVEAU: Référence à l'input file
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private offlineService: OfflineService,
    private authService: AuthService,
    private photoService: PhotoService, // NOUVEAU
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const selectedVehicle = localStorage.getItem('selectedVehicle');
    if (selectedVehicle) {
      this.vehicleId = JSON.parse(selectedVehicle)._id;
    } else {
      this.router.navigate(['/vehicle-selector']);
    }
  }

  async saveIncident() {
    if (!this.incidentType || !this.description) return;

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? currentUser._id : 'mock-driver-id';

    const incident: Incident = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      date: new Date(),
      type: this.incidentType,
      severity: this.severity,
      description: this.description,
      cost: this.cost,
      photos: this.photos.filter(p => p.synced).map(p => p.url!), // MODIFIÉ: Ajouter URLs des photos synchronisées
      synced: 0
    };

    console.log('Saving incident:', incident);
    await this.offlineService.addIncident(incident);
    console.log('Incident saved successfully');
    this.router.navigate(['/trip-list']);
  }

  cancel() {
    this.router.navigate(['/trip-list']);
  }

  // NOUVEAU: Méthodes de gestion des photos
  takePhoto() {
    this.fileInput.nativeElement.click();
  }

  async onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📸 Photo sélectionnée:', file.name);

    // Créer URL locale pour affichage immédiat
    const localUrl = this.photoService.createLocalUrl(file);

    const photo: Photo = {
      file,
      localUrl,
      synced: false
    };

    this.photos.push(photo);
    this.cdr.detectChanges();

    // Si online, uploader immédiatement
    if (navigator.onLine) {
      await this.uploadPhoto(photo);
    } else {
      console.log('⚠️ Offline - Photo sera uploadée plus tard');
      // TODO: Stocker dans IndexedDB pour sync ultérieur
    }

    // Réinitialiser l'input
    event.target.value = '';
  }

  async uploadPhoto(photo: Photo) {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser || !photo.file) return;

      console.log('📤 Upload photo vers Cloudinary...');

      // Compresser l'image avant upload
      const compressedFile = await this.photoService.compressImage(photo.file);

      const result = await this.photoService.uploadPhoto(
        compressedFile,
        'incidents',
        'temp_' + Date.now(), // ID temporaire, sera remplacé après sauvegarde
        currentUser.pays.code,
        currentUser.base.nom
      );

      photo.url = result.url;
      photo.publicId = result.publicId;
      photo.synced = true;

      console.log('✅ Photo uploadée:', result.url);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ Erreur upload photo:', error);
      // Garder la photo en local pour retry plus tard
    }
  }

  async removePhoto(index: number) {
    const photo = this.photos[index];

    // Si la photo est sur Cloudinary, la supprimer
    if (photo.publicId) {
      try {
        await this.photoService.deletePhoto(photo.publicId);
        console.log('✅ Photo supprimée de Cloudinary');
      } catch (error) {
        console.error('❌ Erreur suppression photo:', error);
      }
    }

    // Libérer l'URL locale
    if (photo.localUrl) {
      this.photoService.revokeLocalUrl(photo.localUrl);
    }

    this.photos.splice(index, 1);
    this.cdr.detectChanges();
  }
}
