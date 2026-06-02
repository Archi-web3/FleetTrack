import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkService } from './core/services/network.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('e-logbook');

  constructor(private networkService: NetworkService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.networkService.isOnline$.subscribe(isOnline => {
      if (isOnline) {
        this.snackBar.open('Connexion rétablie. Synchronisation en cours...', 'OK', { duration: 3000 });
      } else {
        this.snackBar.open('Mode Hors-Ligne activé. Vos données seront sauvegardées localement.', 'OK', { duration: 5000 });
      }
    });
  }
}
