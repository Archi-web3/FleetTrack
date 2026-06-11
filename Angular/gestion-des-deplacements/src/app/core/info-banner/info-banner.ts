import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PermissionsService } from '../../services/permissions.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-info-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './info-banner.html',
  styleUrls: ['./info-banner.css'],
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
  
  isExpanded: boolean = true;
  canView: boolean = false;

  constructor(private perms: PermissionsService) {}

  ngOnInit() {
    this.canView = this.perms.hasPermission('admin_settings', 'view_helpers');
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
