import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PaysService, Pays } from '../../../core/services/pays.service';
import { AuthService } from '../../../core/services/auth.service';
import { ContextService } from '../../../core/services/context.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatFormFieldModule, MatIconModule],
  template: `
    <div class="context-wrapper">
      @if (paysList.length > 1 || isSuperAdmin) {
        <div class="country-dropdown-wrapper">
          <mat-icon class="building-icon">public</mat-icon>
          <mat-form-field appearance="outline" class="country-select-field">
            <mat-select [(ngModel)]="selectedCountryId" (selectionChange)="onCountryChange()">
              <mat-option value="all">Tous les pays</mat-option>
              @for (pays of paysList; track pays) {
                <mat-option [value]="pays.id || pays._id"> {{ pays.nom }} </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      } @else if (paysList.length === 1) {
        <div class="country-dropdown-wrapper">
          <mat-icon class="building-icon">public</mat-icon>
          <span class="country-text">{{ paysList[0].nom }}</span>
        </div>
      }

      @if (baseList.length > 1 || isSuperAdmin) {
        <div class="country-dropdown-wrapper" style="margin-left: 10px;">
          <mat-icon class="building-icon">domain</mat-icon>
          <mat-form-field appearance="outline" class="country-select-field">
            <mat-select [(ngModel)]="selectedBaseId" (selectionChange)="onBaseChange()">
              <mat-option value="all">Toutes les bases</mat-option>
              @for (b of baseList; track b) {
                <mat-option [value]="b.id || b._id"> {{ b.nom }} </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      } @else if (baseList.length === 1) {
        <div class="country-dropdown-wrapper" style="margin-left: 10px;">
          <mat-icon class="building-icon">domain</mat-icon>
          <span class="country-text">{{ baseList[0].nom }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .context-wrapper {
        display: flex;
        flex-direction: row;
      }
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
    `,
  ],
})
export class CountrySelectorComponent implements OnInit {
  private paysService = inject(PaysService);
  private authService = inject(AuthService);
  private contextService = inject(ContextService);
  private adminService = inject(AdminService);

  @Output() countryChanged = new EventEmitter<string>();

  paysList: any[] = [];
  baseList: any[] = [];
  selectedCountryId: string | null = null;
  selectedBaseId: string | null = null;
  isSuperAdmin = false;

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) return;

    this.isSuperAdmin = user.profil === 'SuperAdmin';
    
    // Initialize state
    this.selectedCountryId = this.contextService.getSelectedCountry() || 'all';
    this.selectedBaseId = this.contextService.getSelectedBase() || 'all';

    if (this.isSuperAdmin) {
      this.paysService.getPays().subscribe(pays => {
        this.paysList = pays;
        this.loadBases();
      });
    } else {
      this.paysList = Array.isArray(user.pays) ? user.pays : [];
      if (this.paysList.length === 1) {
        this.selectedCountryId = this.paysList[0].id || this.paysList[0]._id;
        this.contextService.setSelectedCountry(this.selectedCountryId);
      }
      this.loadBases();
    }
  }

  loadBases() {
    const paysFilter = this.selectedCountryId && this.selectedCountryId !== 'all' ? this.selectedCountryId : undefined;
    this.adminService.getBases(paysFilter).subscribe(bases => {
      // If not super admin, filter bases to user's allowed bases
      if (!this.isSuperAdmin) {
        const user = this.authService.getUser();
        const allowedBases = Array.isArray(user.base) ? user.base.map((b: any) => b.id || b._id) : [];
        this.baseList = bases.filter(b => allowedBases.includes(b._id || b.id));
      } else {
        this.baseList = bases;
      }
      
      if (this.baseList.length === 1) {
         this.selectedBaseId = this.baseList[0].id || this.baseList[0]._id;
         this.contextService.setSelectedBase(this.selectedBaseId);
      }
    });
  }

  onCountryChange(): void {
    if (this.selectedCountryId) {
      this.contextService.setSelectedCountry(this.selectedCountryId);
      this.countryChanged.emit(this.selectedCountryId);
      window.location.reload();
    }
  }

  onBaseChange(): void {
    if (this.selectedBaseId) {
      this.contextService.setSelectedBase(this.selectedBaseId);
      window.location.reload();
    }
  }
}
