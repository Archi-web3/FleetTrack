import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OfflineService, Fuel } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';
import { PhotoService, Photo } from '../../core/services/photo.service';

@Component({
  selector: 'app-fuel-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './fuel-form.html',
  styleUrls: ['./fuel-form.scss']
})
export class FuelFormComponent implements OnInit {
  fuelForm!: FormGroup;
  vehicleId: string = '';
  lastMileage: number = 0;

  // NOUVEAU: Photos
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  photos: Photo[] = [];

  constructor(
    private fb: FormBuilder,
    private offlineService: OfflineService,
    private authService: AuthService,
    private photoService: PhotoService,
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

  async ngOnInit() {
    // Initialize form IMMEDIATELY (synchronously)
    this.fuelForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(0.1)]],
      mileage: [null, [Validators.required, Validators.min(0)], [this.mileageValidator.bind(this)]],
      fuelType: ['Diesel', Validators.required],
      source: ['Station Service', Validators.required],
      isFull: [true], // Default to full tank
      price: [null, Validators.min(0)]
    });

    // Then load async data
    try {
      // Get last mileage for validation
      this.lastMileage = await this.offlineService.getLastMileage(this.vehicleId);

      // Update form validation with loaded mileage
      this.fuelForm.get('mileage')?.updateValueAndValidity();
    } catch (error) {
      console.error('Error loading fuel data:', error);
    }
  }

  // Async validator for mileage
  async mileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value) return null;

    const currentMileage = control.value;
    if (currentMileage < this.lastMileage) {
      return {
        mileageTooLow: {
          lastMileage: this.lastMileage,
          current: currentMileage
        }
      };
    }
    return null;
  }

  async saveFuel() {
    if (this.fuelForm.invalid) {
      this.fuelForm.markAllAsTouched();
      return;
    }

    // NOUVEAU: Vérifier si des photos sont en cours d'upload
    const pendingCount = this.getPendingUploadsCount();
    if (pendingCount > 0) {
      const confirmSave = confirm(
        `⚠️ Attention : ${pendingCount} photo(s) sont encore en cours d'upload.\n\n` +
        `Si vous continuez maintenant, ces photos ne seront pas incluses.\n\n` +
        `Voulez-vous continuer quand même ?`
      );
      if (!confirmSave) {
        return;
      }
    }

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? currentUser._id : 'mock-driver-id';

    const formValue = this.fuelForm.value;
    const fuel: Fuel = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      date: new Date(),
      quantity: formValue.quantity,
      mileage: formValue.mileage,
      type: formValue.fuelType,
      source: formValue.source,
      isFull: formValue.isFull,
      price: formValue.price,
      photos: this.photos.filter(p => p.synced).map(p => p.url!), // NOUVEAU: Photos synchronisées
      synced: 0
    };

    console.log('Saving fuel:', fuel);
    await this.offlineService.addFuel(fuel);
    console.log('Fuel saved successfully');
    this.router.navigate(['/fuels']);
  }

  cancel() {
    this.router.navigate(['/fuels']);
  }

  // Helper to get error message for mileage
  getMileageError(): string {
    const control = this.fuelForm.get('mileage');
    if (control?.hasError('required')) {
      return 'Le kilométrage est requis';
    }
    if (control?.hasError('min')) {
      return 'Le kilométrage doit être positif';
    }
    if (control?.hasError('mileageTooLow')) {
      const error = control.getError('mileageTooLow');
      return `Le kilométrage ne peut pas être inférieur au dernier enregistré (${error.lastMileage} km)`;
    }
    return '';
  }

  // NOUVEAU: Méthodes de gestion des photos
  takePhoto() {
    this.fileInput.nativeElement.click();
  }

  getPendingUploadsCount(): number {
    return this.photos.filter(p => !p.synced).length;
  }

  async onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📸 Photo sélectionnée:', file.name);

    // Créer URL locale pour affichage immédiat
    const localUrl = this.photoService.createLocalUrl(file);
    const photo: Photo = {
      localUrl,
      file,
      synced: false
    };
    this.photos.push(photo);
    this.cdr.detectChanges();

    // Upload vers Cloudinary
    console.log('📤 Upload photo vers Cloudinary...');
    const currentUser = this.authService.getCurrentUser();
    const country = currentUser?.pays?.nom || 'Unknown';
    const base = currentUser?.base?.nom || 'Unknown';

    try {
      const compressedFile = await this.photoService.compressImage(file);
      const recordId = `temp_${Date.now()}`;
      const result = await this.photoService.uploadPhoto(compressedFile, 'fuels', recordId, country, base);

      console.log('✅ Photo uploadée:', result.url);
      photo.url = result.url;
      photo.publicId = result.publicId;
      photo.synced = true;
      photo.uploadedAt = new Date();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ Erreur upload photo:', error);
      photo.synced = false;
    }

    event.target.value = '';
  }

  async removePhoto(index: number) {
    const photo = this.photos[index];
    if (photo.localUrl) {
      this.photoService.revokeLocalUrl(photo.localUrl);
    }
    if (photo.publicId) {
      try {
        await this.photoService.deletePhoto(photo.publicId);
      } catch (error) {
        console.error('Erreur suppression photo:', error);
      }
    }
    this.photos.splice(index, 1);
    this.cdr.detectChanges();
  }
}
