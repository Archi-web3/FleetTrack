import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // <<< Assurez-vous que l'import est correct


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
