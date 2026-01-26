import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaysService, Pays } from '../pays.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div *ngIf="isSuperAdmin" style="display: flex; align-items: center; margin-right: 20px;">
      <mat-form-field appearance="outline" style="width: 200px;">
        <mat-label>Pays</mat-label>
        <mat-select [(ngModel)]="selectedCountryId" (selectionChange)="onCountryChange()">
          <mat-option value="none">Aucun</mat-option>
          <mat-option value="all">Tous</mat-option>
          <mat-option *ngFor="let pays of paysList" [value]="pays._id">
            {{pays.nom}} ({{pays.code}})
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    
    <div *ngIf="!isSuperAdmin && userCountry" style="display: flex; align-items: center; margin-right: 20px;">
      <span style="background-color: #005fb6; color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px;">
        📍 {{userCountry.nom}}
      </span>
    </div>
  `,
  styles: [`
  styles: [`
    mat - form - field {
      margin- left: 15px;
  font- size: 14px;
    }
    :: ng - deep.mat - mdc - text - field - wrapper {
  background - color: white!important; /* Force white background for the input box so it's not transparent/ugly on blue */
  border - radius: 4px;
  height: 40px; /* Reduced height */
  padding: 0 10px;
}
    :: ng - deep.mat - mdc - form - field - flex {
  height: 40px;
  align - items: center;
}
    :: ng - deep.mat - mdc - form - field - infix {
  padding - top: 8px!important;
  padding - bottom: 0!important;
  min - height: 40px!important;
}
    :: ng - deep.mat - mdc - floating - label {
  top: 8px!important;
}
`]
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
          this.selectedCountryId = stored ? stored : 'none';
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
      if (this.selectedCountryId === 'none') {
        this.paysService.clearSelectedCountry();
      } else {
        this.paysService.setSelectedCountry(this.selectedCountryId);
      }
      this.countryChanged.emit(this.selectedCountryId);
      // Reload page to apply new country filter
      window.location.reload();
    }
  }
}
