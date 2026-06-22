import { Component } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './user-guide.html',
  styleUrl: './user-guide.scss',
})
export class UserGuideComponent {

}
