import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from '../personal-info/personal-info';
import { ChangePasswordComponent } from '../change-password/change-password';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    PersonalInfoComponent, 
    ChangePasswordComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  activeTab: 'personal' | 'password' = 'personal';

  setTab(tab: 'personal' | 'password') {
    this.activeTab = tab;
  }
}
