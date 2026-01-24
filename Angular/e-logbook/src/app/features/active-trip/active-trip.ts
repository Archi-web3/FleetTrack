import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OfflineService, Trip, Lieu, User, GpsPoint } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';
import { PhotoService, Photo } from '../../core/services/photo.service';

@Component({
  selector: 'app-active-trip',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './active-trip.html',
  styleUrls: ['./active-trip.scss']
})
export class ActiveTripComponent implements OnInit {
  tripStarted = false;
  startTime: Date | null = null;
  vehicleId: string = '';
  lastMileage: number = 0;
  plannedMovementId: string | undefined;

  // NOUVEAU: GPS Tracking
  gpsEnabled = false;
  gpsTrace: GpsPoint[] = [];
  watchId: number | null = null;
  gpsSignalStatus: 'searching' | 'good' | 'weak' | 'off' = 'off';

  // NOUVEAU: Start from GPS
  useGpsStart: boolean = false;
  gpsStartLocation: { lat: number, lng: number } | null = null;

  // Forms
  startForm!: FormGroup;
  endForm!: FormGroup;

  // NOUVEAU: Photos
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  photos: Photo[] = [];

  // Reference data
  lieux: Lieu[] = [];
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private offlineService: OfflineService,
    private authService: AuthService,
    private photoService: PhotoService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    // Get selected vehicle from localStorage and check GPS config
    const selectedVehicleStr = localStorage.getItem('selectedVehicle');
    if (selectedVehicleStr) {
      const v = JSON.parse(selectedVehicleStr);
      this.vehicleId = v._id;
      this.gpsEnabled = !!v.enableGpsTracking;
      if (this.gpsEnabled) console.log('🛰️ GPS Tracking activé pour ce véhicule');
    } else {
      // If no vehicle selected, redirect to vehicle selector
      this.router.navigate(['/vehicle-selector']);
    }
  }

  async ngOnInit() {
    console.log('ActiveTripComponent initialized');

    // Initialize forms IMMEDIATELY (synchronously) to prevent NG01052 error
    this.startForm = this.fb.group({
      startMileage: [null, [Validators.required, Validators.min(0)], [this.startMileageValidator.bind(this)]],
      purpose: ['', Validators.required],
      departurePlaceId: ['', Validators.required], // Will be conditional
      passengerIds: [[]]
    });

    this.endForm = this.fb.group({
      endMileage: [null, [Validators.required, Validators.min(0)], [this.endMileageValidator.bind(this)]],
      arrivalPlaceId: ['', Validators.required]
    });

    // NOUVEAU: Charger trip actif si existant
    this.loadActiveTrip();

    // Then load async data
    try {
      // Get last mileage for validation
      this.lastMileage = await this.offlineService.getLastMileage(this.vehicleId);

      // Update form validation with loaded mileage
      this.startForm.get('startMileage')?.updateValueAndValidity();

      // NOUVEAU: Pré-remplissage automatique du kilométrage
      const currentStart = this.startForm.get('startMileage')?.value;
      if (!currentStart && this.lastMileage > 0) {
        this.startForm.patchValue({ startMileage: this.lastMileage });
        console.log('✅ Kilométrage pré-rempli:', this.lastMileage);
      }

      this.lieux = await this.offlineService.lieux.toArray();
      console.log('Lieux loaded from Dexie:', this.lieux);

      this.users = await this.offlineService.users.toArray();
      console.log('Users loaded from Dexie:', this.users);

      // Check if we have a planned movement from navigation state
      const navigation = this.router.getCurrentNavigation();
      const plannedMovement = navigation?.extras?.state?.['plannedMovement'] ||
        (history.state?.plannedMovement);

      if (plannedMovement) {
        console.log('Pre-filling from planned movement:', plannedMovement);
        this.plannedMovementId = plannedMovement._id || plannedMovement.id; // Capture ID
        this.preFillFromPlannedMovement(plannedMovement);
      }
    } catch (error) {
      console.error('Error loading reference data:', error);
    }
  }

  preFillFromPlannedMovement(movement: any) {
    // Pre-fill start form
    if (movement.objectif) {
      this.startForm.patchValue({
        purpose: movement.objectif
      });
    }

    if (movement.stops && movement.stops.length > 0) {
      // Departure place (first stop)
      const departurePlace = movement.stops[0].lieu;
      if (departurePlace) {
        this.startForm.patchValue({
          departurePlaceId: departurePlace._id || departurePlace
        });
      }

      // Arrival place (last stop)
      const arrivalPlace = movement.stops[movement.stops.length - 1].lieu;
      if (arrivalPlace) {
        this.endForm.patchValue({
          arrivalPlaceId: arrivalPlace._id || arrivalPlace
        });
      }
    }

    // Pre-fill passengers
    if (movement.passagers && movement.passagers.length > 0) {
      const passengerIds = movement.passagers.map((p: any) => p._id || p);
      this.startForm.patchValue({
        passengerIds: passengerIds
      });
    }

    console.log('Form pre-filled with planned movement data');
  }

  // Async validator for start mileage
  async startMileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
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

  // Async validator for end mileage
  async endMileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value) return null;

    const endMileage = control.value;
    const startMileage = this.startForm?.get('startMileage')?.value;

    // Check if end mileage is less than last recorded
    if (endMileage < this.lastMileage) {
      return {
        mileageTooLow: {
          lastMileage: this.lastMileage,
          current: endMileage
        }
      };
    }

    // Check if end mileage is less than start mileage
    if (startMileage && endMileage < startMileage) {
      return {
        endLessThanStart: {
          startMileage: startMileage,
          endMileage: endMileage
        }
      };
    }

    return null;
  }



  // NOUVEAU: Toggle GPS Start
  toggleGpsStart() {
    this.useGpsStart = !this.useGpsStart;
    const deptControl = this.startForm.get('departurePlaceId');

    if (this.useGpsStart) {
      deptControl?.clearValidators();
      deptControl?.setValue(null); // Clear value
      deptControl?.disable();
      console.log('📍 Mode GPS Start activé');
    } else {
      deptControl?.setValidators([Validators.required]);
      deptControl?.enable();
      console.log('📍 Mode Lieu liste activé');
    }
    deptControl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  // NOUVEAU: Abort active trip
  abortTrip() {
    if (confirm('Êtes-vous sûr de vouloir annuler ce trajet en cours ?\nToutes les données seront perdues.')) {
      this.clearActiveTrip();
      this.router.navigate(['/trip-list']);
    }
  }

  async startTrip() {
    if (this.startForm.invalid) {
      this.startForm.markAllAsTouched();
      return;
    }

    this.tripStarted = true;
    this.startTime = new Date();

    // NOUVEAU: Appeler backend si mouvement planifié
    if (this.plannedMovementId) {
      try {
        await this.updateMovementStatus();
      } catch (error) {
        console.error('Erreur mise à jour statut:', error);
        // Continuer même si l'appel backend échoue (mode offline)
      }
    }

    // NOUVEAU: Sauvegarder état dans localStorage
    this.saveActiveTrip();

    // NOUVEAU: Démarrer GPS si activé
    if (this.gpsEnabled) {
      this.startGpsTracking();
    }
  }

  async stopTrip() {
    if (this.endForm.invalid) {
      this.endForm.markAllAsTouched();
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
    const driverId = currentUser ? (currentUser._id || currentUser.id) : 'mock-driver-id';

    if (!driverId) {
      console.error('Driver ID not found in current user:', currentUser);
      alert('Erreur: Impossible d\'identifier le chauffeur. Veuillez vous reconnecter.');
      return;
    }

    const startFormValue = this.startForm.value;
    const endFormValue = this.endForm.value;

    const trip: Trip = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      startDateTime: this.startTime!,
      endDateTime: new Date(),
      startMileage: startFormValue.startMileage,
      endMileage: endFormValue.endMileage,
      purpose: startFormValue.purpose,
      departurePlaceId: startFormValue.departurePlaceId,
      arrivalPlaceId: endFormValue.arrivalPlaceId,
      passengerIds: startFormValue.passengerIds,
      photos: this.photos.filter(p => p.synced).map(p => p.url!), // NOUVEAU: Photos synchronisées
      gpsTrace: this.gpsTrace, // NOUVEAU: Tracé GPS complet
      synced: 0,
      plannedMovementId: this.plannedMovementId // Include plannedMovementId if present
    };

    // NOUVEAU: Arrêter GPS
    this.stopGpsTracking();

    console.log('Saving trip:', trip);
    await this.offlineService.addTrip(trip);
    console.log('Trip saved successfully');

    // NOUVEAU: Nettoyer localStorage
    this.clearActiveTrip();

    this.router.navigate(['/trip-list']);
  }

  cancel() {
    // MODIFIÉ: Ne pas nettoyer si trip démarré
    if (!this.tripStarted) {
      this.clearActiveTrip();
    }
    this.router.navigate(['/trip-list']);
  }

  // NOUVEAU: Retourner au menu en gardant le trip actif
  returnToMenu() {
    this.saveActiveTrip();
    this.router.navigate(['/dashboard']);
  }

  // NOUVEAU: Sauvegarder trip en cours
  saveActiveTrip() {
    const activeTripData = {
      tripStarted: this.tripStarted,
      startTime: this.startTime?.toISOString(),
      startFormValue: this.startForm.value,
      plannedMovementId: this.plannedMovementId,
      vehicleId: this.vehicleId,
      gpsTrace: this.gpsTrace // Sauvegarde partielle du tracé
    };
    localStorage.setItem('activeTrip', JSON.stringify(activeTripData));
    console.log('✅ Trip actif sauvegardé dans localStorage');
  }

  // NOUVEAU: Charger trip en cours
  loadActiveTrip() {
    const saved = localStorage.getItem('activeTrip');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.tripStarted = data.tripStarted;
        this.startTime = data.startTime ? new Date(data.startTime) : null;
        this.plannedMovementId = data.plannedMovementId;
        this.gpsTrace = data.gpsTrace || []; // Restaurer tracé

        if (this.tripStarted && this.gpsEnabled) {
          this.startGpsTracking(); // Reprendre le tracking si refresh
        }

        // Restaurer les valeurs du formulaire
        if (data.startFormValue) {
          this.startForm.patchValue(data.startFormValue);
        }

        console.log('✅ Trip actif restauré depuis localStorage');
      } catch (error) {
        console.error('Erreur chargement trip actif:', error);
        this.clearActiveTrip();
      }
    }
  }

  // NOUVEAU: Nettoyer localStorage
  clearActiveTrip() {
    localStorage.removeItem('activeTrip');
    this.stopGpsTracking(); // Sécurité
    console.log('🗑️ Trip actif supprimé du localStorage');
  }

  // NOUVEAU: Appeler backend pour mettre statut "en cours"
  async updateMovementStatus() {
    if (!this.plannedMovementId) return;

    const apiUrl = 'https://fleettrack-api.onrender.com/api';
    const token = localStorage.getItem('token'); // Utiliser localStorage directement

    try {
      const response = await this.http.put(
        `${apiUrl}/mouvements/${this.plannedMovementId}/start`,
        {
          realDepartureTime: this.startTime?.toISOString(),
          startMileage: this.startForm.get('startMileage')?.value
        },
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      ).toPromise();

      console.log('✅ Statut mouvement mis à jour:', response);
    } catch (error) {
      console.error('❌ Erreur mise à jour statut mouvement:', error);
      throw error;
    }
  }

  // Helper to get error message for start mileage
  getStartMileageError(): string {
    const control = this.startForm.get('startMileage');
    if (control?.hasError('required')) {
      return 'Le kilométrage de départ est requis';
    }
    if (control?.hasError('min')) {
      return 'Le kilométrage doit être positif';
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
}

// Helper to get error message for end mileage
getEndMileageError(): string {
  const control = this.endForm.get('endMileage');
  if (control?.hasError('required')) {
    return 'Le kilométrage d\'arrivée est requis';
  }
  if (control?.hasError('min')) {
    return 'Le kilométrage doit être positif';
  }
  if (control?.hasError('mileageTooLow')) {
    const error = control.getError('mileageTooLow');
    return `Le kilométrage ne peut pas être inférieur au dernier enregistré (${error.lastMileage} km)`;
  }
  if (control?.hasError('endLessThanStart')) {
    const error = control.getError('endLessThanStart');
    return `Le kilométrage d'arrivée (${error.endMileage} km) doit être supérieur au kilométrage de départ (${error.startMileage} km)`;
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
    const result = await this.photoService.uploadPhoto(compressedFile, 'trips', recordId, country, base);

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

// --- GPS IMPLEMENTATION ---

startGpsTracking() {
  if (!navigator.geolocation) {
    console.warn('⚠️ Géolocalisation non supportée par ce navigateur');
    return;
  }

  console.log('🛰️ Démarrage du tracking GPS...');
  this.gpsSignalStatus = 'searching';

  // Options: Haute précision, timeout 10s, maxAge 0 (pas de cache)
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  this.watchId = navigator.geolocation.watchPosition(
    (position) => {
      // Success
      this.gpsSignalStatus = position.coords.accuracy < 20 ? 'good' : 'weak';

      const point: GpsPoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed || 0,
        heading: position.coords.heading || 0,
        timestamp: position.timestamp
      };

      // Filtrage simple: ne garder que si mvt > 10m ou toutes les 30s
      // Pour l'instant on garde tout toutes les ~10-30s selon le device, 
      // mais on peut ajouter un filtre ici si trop de données.
      // Simplification: On ajoute tout, on nettoiera au backend ou on throttle si besoin.

      this.gpsTrace.push(point);

      // Sauvegarde incrémentale (tous les 5 points par ex, ou à chaque point)
      // Ici à chaque point pour sécurité max "Boîte Noire"
      this.saveActiveTrip();
      console.log(`📍 GPS Point: ${point.lat}, ${point.lng} (Acc: ${point.accuracy}m)`);
    },
    (error) => {
      // Error
      console.error('❌ Erreur GPS:', error.message);
      this.gpsSignalStatus = 'off';
    },
    options
  );
}

stopGpsTracking() {
  if (this.watchId !== null) {
    navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;
    this.gpsSignalStatus = 'off';
    console.log('🛑 Arrêt du tracking GPS');
  }
}
}
