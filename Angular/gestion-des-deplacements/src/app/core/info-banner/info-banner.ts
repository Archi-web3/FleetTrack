import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermissionsService } from '../services/permissions.service';
import { SettingsService } from '../services/settings.service';
import { AuthService } from '../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-info-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './info-banner.html',
  styleUrls: ['./info-banner.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', padding: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', padding: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('250ms ease-in-out'))
    ])
  ]
})
export class InfoBannerComponent implements OnInit {
  @Input() title: string = 'Note pour les Administrateurs';
  @Input() bannerId!: string;
  
  isExpanded: boolean = true;
  canView: boolean = false;
  isSuperAdmin: boolean = false;
  customContent: string = '';

  constructor(
    private perms: PermissionsService,
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.canView = this.perms.hasPermission('admin_settings', 'view_helpers');
    this.isSuperAdmin = this.authService.getUserProfile() === 'SuperAdmin';
    
    if (this.bannerId) {
      this.settingsService.getInfoBanners().subscribe(banners => {
        if (banners && banners[this.bannerId]) {
          this.customContent = banners[this.bannerId];
        }
      });
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  editContent() {
    if (!this.bannerId) {
      alert("Ce composant n'a pas d'identifiant (bannerId) défini. Impossible de sauvegarder.");
      return;
    }
    const newContent = prompt("Modifiez le texte de l'encart (HTML supporté) :", this.customContent);
    if (newContent !== null) {
      this.customContent = newContent;
      this.settingsService.getInfoBanners().subscribe(banners => {
        const updatedBanners = banners || {};
        updatedBanners[this.bannerId] = newContent;
        this.settingsService.saveInfoBanners(updatedBanners).subscribe();
      });
    }
  }
}
