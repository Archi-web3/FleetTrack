import { Component, ChangeDetectorRef, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
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
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './incident-form.html',
  styleUrls: ['./incident-form.scss'],
})
export class IncidentFormComponent implements OnInit {
  private offlineService = inject(OfflineService);
  private authService = inject(AuthService);
  private photoService = inject(PhotoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  incidentType = 'Panne';
  severity = 'Faible';
  description = '';
  cost: number | undefined;
  photos: Photo[] = [];

  // NOUVEAU: Localisation
  location: { lat: number; lng: number; accuracy: number } | null = null;
  locationStatus: 'loading' | 'success' | 'error' = 'loading';

  vehicleId = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    const selectedVehicle = localStorage.getItem('selectedVehicle');
    if (selectedVehicle) {
      this.vehicleId = JSON.parse(selectedVehicle)._id;
    } else {
      this.router.navigate(['/vehicle-selector']);
    }
  }

  ngOnInit() {
    this.captureLocation();
  }

  captureLocation() {
    this.locationStatus = 'loading';
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          this.locationStatus = 'success';
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('❌ Erreur GPS:', error);
          this.locationStatus = 'error';
          this.cdr.detectChanges();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      this.locationStatus = 'error';
    }
  }
  async saveIncident() {
    if (!this.incidentType || !this.description) return;

    // Vérifier si des photos sont en cours d'upload
    const pendingCount = this.getPendingUploadsCount();
    if (pendingCount > 0) {
      const confirmSave = confirm(
        `⚠️ Attention : ${pendingCount} photo(s) sont encore en cours d'upload.\n\n` +
          `Si vous continuez maintenant, ces photos ne seront pas incluses dans l'incident.\n\n` +
          `Voulez-vous continuer quand même ?`,
      );
      if (!confirmSave) {
        return; // Annuler la sauvegarde
      }
    }

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? currentUser._id : 'mock-driver-id';

    const incident: Incident = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      date: new Date(),
      type: this.incidentType,
      severity: this.severity,
      description: this.description,
      location: this.location
        ? {
            lat: this.location.lat,
            lng: this.location.lng,
            address: (this.location as unknown as { address?: string }).address,
          }
        : undefined,
      cost: this.cost,
      photos: this.photos.filter((p) => p.synced).map((p) => p.url!),
      synced: 0,
    };

    await this.offlineService.addIncident(incident);
    this.router.navigate(['/trip-list']);
  }

  cancel() {
    this.router.navigate(['/trip-list']);
  }

  // NOUVEAU: Méthodes de gestion des photos
  takePhoto() {
    this.fileInput.nativeElement.click();
  }

  // NOUVEAU: Compter les photos en attente d'upload
  getPendingUploadsCount(): number {
    return this.photos.filter((p) => !p.synced).length;
  }

  async onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Créer URL locale pour affichage immédiat
    const localUrl = this.photoService.createLocalUrl(file);

    const photo: Photo = {
      file,
      localUrl,
      synced: false,
    };

    this.photos.push(photo);
    this.cdr.detectChanges();

    // Si online, uploader immédiatement
    if (navigator.onLine) {
      await this.uploadPhoto(photo);
    } else {
      // TODO: Stocker dans IndexedDB pour sync ultérieur
    }

    // Réinitialiser l'input
    if (event.target) {
      (event.target as HTMLInputElement).value = '';
    }
  }

  async uploadPhoto(photo: Photo) {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser || !photo.file) return;

      // Compresser l'image avant upload
      const compressedFile = await this.photoService.compressImage(photo.file);

      const pays: any = currentUser?.['pays'];
      const baseObj: any = currentUser?.['base'];
      const country = (typeof pays === 'object' && pays !== null ? pays.nom || pays.code : pays) || 'Unknown';
      const base = (typeof baseObj === 'object' && baseObj !== null ? baseObj.nom : baseObj) || 'Unknown';

      const result = await this.photoService.uploadPhoto(
        compressedFile,
        'incidents',
        'temp_' + Date.now(), // ID temporaire, sera remplacé après sauvegarde
        country,
        base,
      );

      photo.url = result.url;
      photo.publicId = result.publicId;
      photo.synced = true;

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
