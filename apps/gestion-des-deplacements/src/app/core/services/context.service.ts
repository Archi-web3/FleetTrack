import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaysService } from './pays.service';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private paysService = inject(PaysService);

  private readonly BASE_STORAGE_KEY = 'selectedBase';

  private selectedCountrySubject = new BehaviorSubject<string | null>(this.paysService.getSelectedCountry());
  private selectedBaseSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.BASE_STORAGE_KEY));

  selectedCountry$ = this.selectedCountrySubject.asObservable();
  selectedBase$ = this.selectedBaseSubject.asObservable();

  getSelectedCountry(): string | null {
    return this.selectedCountrySubject.value;
  }

  setSelectedCountry(countryId: string | null): void {
    if (countryId) {
      this.paysService.setSelectedCountry(countryId);
      this.selectedCountrySubject.next(countryId);
    } else {
      this.paysService.clearSelectedCountry();
      this.selectedCountrySubject.next(null);
    }
    // Si on change de pays, on reset la base (sauf si on gère autrement)
    this.setSelectedBase(null);
  }

  getSelectedBase(): string | null {
    return this.selectedBaseSubject.value;
  }

  setSelectedBase(baseId: string | null): void {
    if (baseId) {
      localStorage.setItem(this.BASE_STORAGE_KEY, baseId);
      this.selectedBaseSubject.next(baseId);
    } else {
      localStorage.removeItem(this.BASE_STORAGE_KEY);
      this.selectedBaseSubject.next(null);
    }
  }
}
