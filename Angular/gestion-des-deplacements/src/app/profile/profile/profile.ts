import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from '../personal-info/personal-info';
import { ChangePasswordComponent } from '../change-password/change-password';
import { NotificationPreferencesComponent } from '../notification-preferences/notification-preferences';
import { ActiveDevicesComponent } from '../active-devices/active-devices';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoComponent,
    ChangePasswordComponent,
    NotificationPreferencesComponent,
    ActiveDevicesComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  activeTab: string = 'personal-info';

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
