import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VehiculeService } from '../../vehicule.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-profile',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTabsModule, MatCardModule, 
    MatIconModule, MatButtonModule, MatDividerModule, TranslateModule
  ],
  templateUrl: './vehicle-profile.html',
  styleUrls: ['./vehicle-profile.scss']
})
export class VehicleProfileComponent implements OnInit {
  vehicle: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(id);
    }
  }

  loadVehicle(id: string): void {
    this.vehiculeService.getVehiculeById(id).subscribe({
      next: (data) => {
        this.vehicle = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vehicle:', err);
        this.loading = false;
      }
    });
  }
}
