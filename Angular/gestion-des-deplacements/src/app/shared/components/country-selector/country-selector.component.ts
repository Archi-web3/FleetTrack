import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PaysService, Pays } from '../../../core/services/pays.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatIconModule],
  template: `
    <div *ngIf="isSuperAdmin" class="country-dropdown-wrapper">
      <mat-icon class="building-icon">domain</mat-icon>
      <mat-form-field appearance="outline" class="country-select-field">
        <mat-select [(ngModel)]="selectedCountryId" (selectionChange)="onCountryChange()">
          <mat-option value="none">Aucun</mat-option>
          <mat-option value="all">Tous</mat-option>
          <mat-option *ngFor="let pays of paysList" [value]="pays._id">
            {{pays.nom}} ({{pays.code}})
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    
    <div *ngIf="!isSuperAdmin && userCountry" class="country-dropdown-wrapper">
      <mat-icon class="building-icon">domain</mat-icon>
      <span class="country-text">{{userCountry.nom}}</span>
    </div>
  `,
  styles: [`
    .country-dropdown-wrapper {
      display: flex;
      align-items: center;
      background-color: #334155;
      padding: 0 12px;
      border-radius: 6px;
      height: 36px;
    }
    .building-icon {
      color: #94a3b8;
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    .country-text {
      color: white;
      font-size: 14px;
      font-weight: 500;
    }
    
    .country-select-field {
      width: 180px;
    }
    
    /* Remove outline/background from form field to let wrapper show */
    ::ng-deep .country-select-field .mat-mdc-text-field-wrapper {
      background-color: transparent !important;
      padding: 0 !important;
    }
    ::ng-deep .country-select-field .mdc-notched-outline {
      display: none !important; /* Hide border */
    }
    ::ng-deep .country-select-field .mat-mdc-form-field-flex {
      height: 36px !important;
      align-items: center;
      padding: 0 !important;
    }
    ::ng-deep .country-select-field .mat-mdc-form-field-infix {
      padding: 0 !important;
      min-height: auto !important;
      width: auto !important;
      display: flex;
      align-items: center;
    }
    ::ng-deep .country-select-field .mat-mdc-select-value {
      color: white !important;
      font-weight: 500;
      font-size: 14px;
    }
    ::ng-deep .country-select-field .mat-mdc-select-arrow {
      color: #94a3b8 !important;
    }
  `]
})
export class CountrySelectorComponent implements OnInit {
  @Output() countryChanged = new EventEmitter<string>();

  paysList: Pays[] = [];
  selectedCountryId: string | null = null;
  isSuperAdmin: boolean = false;
  userCountry: any = null;

  constructor(
    private paysService: PaysService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check if user is SuperAdmin
    this.isSuperAdmin = this.authService.getUserProfile() === 'SuperAdmin';

    // Only load countries if user is authenticated
    if (!this.authService.getToken()) {
      return; // User not authenticated yet
    }

    // Load countries list
    this.paysService.getPays().subscribe({
      next: (pays) => {
        this.paysList = pays;

        if (this.isSuperAdmin) {
          // Load selected country from localStorage
          const stored = this.paysService.getSelectedCountry();
          // Default to 'all' if nothing stored (Global View)
          this.selectedCountryId = stored ? stored : 'all';
        } else {
          // For non-SuperAdmin, get their assigned country
          const user = this.authService.getUser();
          this.userCountry = user?.pays;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pays:', err);
      }
    });
  }

  onCountryChange(): void {
    if (this.selectedCountryId) {
      // Save selection (including 'all' and 'none') to localStorage
      this.paysService.setSelectedCountry(this.selectedCountryId);

      this.countryChanged.emit(this.selectedCountryId);
      // Reload page to apply new country filter
      window.location.reload();
    }
  }
}
