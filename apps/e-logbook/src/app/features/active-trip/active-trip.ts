import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OfflineService, Trip, Lieu, User, GpsPoint } from '../../core/services/offline.service';
import { Movement, UserRef, LieuRef } from '../../core/models/api.types';
import { AuthService } from '../../core/services/auth.service';
import { PhotoService, Photo } from '../../core/services/photo.service';
import { SyncService } from '../../core/services/sync.service';
import { TranslateModule } from '@ngx-translate/core';

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
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './active-trip.html',
  styleUrls: ['./active-trip.scss'],
})
export class ActiveTripComponent implements OnInit {
  private fb = inject(FormBuilder);
  private offlineService = inject(OfflineService);
  private authService = inject(AuthService);
  private photoService = inject(PhotoService);
  private syncService = inject(SyncService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  tripStarted = false;
  startTime: Date | null = null;
  vehicleId = '';
  lastMileage = 0;
  plannedMovementId: string | undefined;

  // NOUVEAU: GPS Tracking
  gpsEnabled = false;
  gpsTrace: GpsPoint[] = [];
  watchId: number | null = null;
  gpsSignalStatus: 'searching' | 'good' | 'weak' | 'off' = 'off';

  // NOUVEAU: Start from GPS
  useGpsStart = false;
  useGpsEnd = false;
  gpsStartLocation: { lat: number; lng: number } | null = null;

  // Forms
  startForm!: FormGroup;
  endForm!: FormGroup;

  // NOUVEAU: Photos
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  photos: Photo[] = [];

  // Reference data
  lieux: Lieu[] = [];
  users: User[] = [];

  async ngOnInit() {
    // 0. Initialize Vehicle ID (CRITICAL FIX)
    const savedVehicle = localStorage.getItem('selectedVehicle');
    if (savedVehicle) {
      try {
        const v = JSON.parse(savedVehicle);
        this.vehicleId = v._id || v.id;
      } catch (e) {
        console.error('Error parsing selectedVehicle', e);
      }
    }

    if (!this.vehicleId) {
      const user = this.authService.getCurrentUser();
      if (user && user['vehicule']) {
        const v = user['vehicule'] as unknown as { _id?: string };
        this.vehicleId = v._id || String(user['vehicule']);
      }
    }

    // Initialize forms IMMEDIATELY
    this.startForm = this.fb.group({
      startMileage: [
        null,
        [Validators.required, Validators.min(0)],
        [this.startMileageValidator.bind(this)],
      ],
      purpose: ['', Validators.required],
      departurePlaceId: ['', Validators.required],
      passengerIds: [[]],
    });

    this.endForm = this.fb.group({
      endMileage: [
        null,
        [Validators.required, Validators.min(0)],
        [this.endMileageValidator.bind(this)],
      ],
      arrivalPlaceId: ['', Validators.required],
    });

    this.loadActiveTrip();

    try {
      // 1. Initial Load (Offline / Fast)
      if (this.vehicleId) {
        this.lastMileage = await this.offlineService.getLastMileage(this.vehicleId);
        this.updateStartMileageIfEmpty(); // Helper method
      } else {
        console.warn('⚠️ No Vehicle ID found. Cannot fetch last mileage.');
      }

      this.lieux = await this.offlineService.lieux.toArray();
      this.users = await this.offlineService.users.toArray();

      // 2. Automatic Sync Trigger (Online Only)
      if (navigator.onLine) {
        try {
          // Utiliser syncData qui fait push puis pull (donc récupère les derniers trajets des autres)
          await this.syncService.syncData();

          // 3. Refresh Mileage after Sync
          if (this.vehicleId) {
            const newLastMileage = await this.offlineService.getLastMileage(this.vehicleId);
            if (newLastMileage > this.lastMileage) {
              this.lastMileage = newLastMileage;
              this.updateStartMileageIfEmpty();
            }
          }
        } catch (err) {
          console.error('Erreur synchro auto:', err);
        }
      }

      // Check for planned movement (rest of original ngOnInit logic)
      const navigation = this.router.getCurrentNavigation();
      const plannedMovement =
        navigation?.extras?.state?.['plannedMovement'] || history.state?.plannedMovement;

      if (plannedMovement) {
        this.plannedMovementId = plannedMovement._id || plannedMovement.id;
        this.preFillFromPlannedMovement(plannedMovement);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  updateStartMileageIfEmpty() {
    // Update form validation
    this.startForm.get('startMileage')?.updateValueAndValidity();

    // Pre-fill if empty
    const currentStart = this.startForm.get('startMileage')?.value;
    if ((!currentStart || currentStart < this.lastMileage) && this.lastMileage > 0) {
      this.startForm.patchValue({ startMileage: this.lastMileage });
    }
  }

  preFillFromPlannedMovement(movement: Movement) {
    // Pre-fill start form
    if (movement.objectif) {
      this.startForm.patchValue({
        purpose: movement.objectif,
      });
    }

    if (movement.stops && movement.stops.length > 0) {
      // Departure place (first stop)
      const departurePlace = movement.stops[0].lieu;
      if (departurePlace) {
        this.startForm.patchValue({
          departurePlaceId: typeof departurePlace === 'object' && departurePlace !== null ? (departurePlace as LieuRef)._id : departurePlace,
        });
      }

      // Arrival place (last stop)
      const arrivalPlace = movement.stops[movement.stops.length - 1].lieu;
      if (arrivalPlace) {
        this.endForm.patchValue({
          arrivalPlaceId: typeof arrivalPlace === 'object' && arrivalPlace !== null ? (arrivalPlace as LieuRef)._id : arrivalPlace,
        });
      }
    }

    // Pre-fill passengers
    if (movement.passagers && movement.passagers.length > 0) {
      const passengerIds = movement.passagers.map((p: UserRef | string) => typeof p === 'object' ? (p as UserRef)._id : p);
      this.startForm.patchValue({
        passengerIds: passengerIds,
      });
    }
  }

  // Async validator for start mileage
  async startMileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value) return null;

    const currentMileage = control.value;
    if (currentMileage < this.lastMileage) {
      return {
        mileageTooLow: {
          lastMileage: this.lastMileage,
          current: currentMileage,
        },
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
          current: endMileage,
        },
      };
    }

    // Check if end mileage is less than start mileage
    if (startMileage && endMileage < startMileage) {
      return {
        endLessThanStart: {
          startMileage: startMileage,
          endMileage: endMileage,
        },
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
    } else {
      deptControl?.setValidators([Validators.required]);
      deptControl?.enable();
    }
    deptControl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  // NOUVEAU: Toggle GPS End
  toggleGpsEnd() {
    this.useGpsEnd = !this.useGpsEnd;
    const arrControl = this.endForm.get('arrivalPlaceId');

    if (this.useGpsEnd) {
      arrControl?.clearValidators();
      arrControl?.setValue(null);
      arrControl?.disable();
    } else {
      arrControl?.setValidators([Validators.required]);
      arrControl?.enable();
    }
    arrControl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  // NOUVEAU: Abort active trip
  abortTrip() {
    if (
      confirm(
        'Êtes-vous sûr de vouloir annuler ce trajet en cours ?\nToutes les données seront perdues.',
      )
    ) {
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
          `Voulez-vous continuer quand même ?`,
      );
      if (!confirmSave) {
        return;
      }
    }

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? currentUser._id || String(currentUser['id'] || 'mock-driver-id') : 'mock-driver-id';

    if (!driverId) {
      console.error('Driver ID not found in current user:', currentUser);
      alert("Erreur: Impossible d'identifier le chauffeur. Veuillez vous reconnecter.");
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
      photos: this.photos.filter((p) => p.synced).map((p) => p.url!), // NOUVEAU: Photos synchronisées
      gpsTrace: this.gpsTrace, // NOUVEAU: Tracé GPS complet
      synced: 0,
      plannedMovementId: this.plannedMovementId, // Include plannedMovementId if present
    };

    // NOUVEAU: Arrêter GPS
    this.stopGpsTracking();

    // --- DEBUG MOBILE ---
    // alert(`Fin du trajet. Trace GPS: ${this.gpsTrace ? this.gpsTrace.length : 0} points. Enabled: ${this.gpsEnabled ? 'OUI' : 'NON'}`);
    // --------------------

    await this.offlineService.addTrip(trip);
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
      gpsTrace: this.gpsTrace, // Sauvegarde partielle du tracé
    };
    localStorage.setItem('activeTrip', JSON.stringify(activeTripData));
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
  }

  // Call backend to mark movement as 'in progress'
  async updateMovementStatus() {
    if (!this.plannedMovementId) return;

    const apiUrl = 'https://fleettrack-api.onrender.com/api';

    try {
      const response = await this.http
        .put(`${apiUrl}/mouvements/${this.plannedMovementId}/start`, {
          realDepartureTime: this.startTime?.toISOString(),
          startMileage: this.startForm.get('startMileage')?.value,
        })
        .toPromise();
    } catch (error) {
      console.error('Error updating movement status:', error);
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

  // Helper to get error message for end mileage
  getEndMileageError(): string {
    const control = this.endForm.get('endMileage');
    if (control?.hasError('required')) {
      return "Le kilométrage d'arrivée est requis";
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
    return this.photos.filter((p) => !p.synced).length;
  }

  async onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Créer URL locale pour affichage immédiat
    const localUrl = this.photoService.createLocalUrl(file);
    const photo: Photo = {
      localUrl,
      file,
      synced: false,
    };
    this.photos.push(photo);
    this.cdr.detectChanges();

    // Upload vers Cloudinary
    const currentUser = this.authService.getCurrentUser();
    const pays: any = currentUser?.['pays'];
    const baseObj: any = currentUser?.['base'];
    const country = (typeof pays === 'object' && pays !== null ? pays.nom : pays) || 'Unknown';
    const base = (typeof baseObj === 'object' && baseObj !== null ? baseObj.nom : baseObj) || 'Unknown';

    try {
      const compressedFile = await this.photoService.compressImage(file);
      const recordId = `temp_${Date.now()}`;
      const result = await this.photoService.uploadPhoto(
        compressedFile,
        'trips',
        recordId,
        country,
        base,
      );

      photo.url = result.url;
      photo.publicId = result.publicId;
      photo.synced = true;
      photo.uploadedAt = new Date();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ Erreur upload photo:', error);
      photo.synced = false;
    }

    if (event.target) {
      (event.target as HTMLInputElement).value = '';
    }
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

    this.gpsSignalStatus = 'searching';

    // Options: Haute précision, timeout 10s, maxAge 0 (pas de cache)
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
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
          timestamp: position.timestamp,
        };

        // Filtrage simple: ne garder que si mvt > 10m ou toutes les 30s
        // Pour l'instant on garde tout toutes les ~10-30s selon le device,
        // mais on peut ajouter un filtre ici si trop de données.
        // Simplification: On ajoute tout, on nettoiera au backend ou on throttle si besoin.

        this.gpsTrace.push(point);

        // Sauvegarde incrémentale (tous les 5 points par ex, ou à chaque point)
        // Ici à chaque point pour sécurité max "Boîte Noire"
        this.saveActiveTrip();
      },
      (error) => {
        // Error
        console.error('❌ Erreur GPS:', error.message);
        this.gpsSignalStatus = 'off';
      },
      options,
    );
  }

  stopGpsTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.gpsSignalStatus = 'off';
    }
  }
}
