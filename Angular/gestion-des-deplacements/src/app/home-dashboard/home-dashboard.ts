import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home-dashboard.html',
  styleUrls: ['./home-dashboard.css']
})
export class HomeDashboardComponent implements OnInit {
  newsBanner: string | null = null;
  userName: string = '';

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'Utilisateur';
    this.settingsService.getBrandSettings().subscribe(settings => {
      if (settings && settings.newsBanner) {
        this.newsBanner = settings.newsBanner;
      }
    });
  }
}
