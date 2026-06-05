import re

# 1. Update general-settings.ts
gs_ts = "src/app/general-settings/general-settings.ts"
with open(gs_ts, "r") as f:
    content = f.read()

content = content.replace(
    "footerText: 'Copyright © 2026, Action Contre la Faim'",
    "footerText: 'Copyright © 2026, Action Contre la Faim',\n    loginBackgroundUrl: ''"
)
with open(gs_ts, "w") as f:
    f.write(content)

# 2. Update general-settings.html
gs_html = "src/app/general-settings/general-settings.html"
with open(gs_html, "r") as f:
    content = f.read()

new_input = """<div class="modern-form-group">
              <label>Texte du pied de page (Footer)</label>
              <input type="text" class="modern-input" [(ngModel)]="brandSettings.footerText">
            </div>
            <div class="modern-form-group">
              <label>URL Image de fond (Login)</label>
              <input type="text" class="modern-input" [(ngModel)]="brandSettings.loginBackgroundUrl" placeholder="https://...">
            </div>"""
content = content.replace(
    """<div class="modern-form-group">
              <label>Texte du pied de page (Footer)</label>
              <input type="text" class="modern-input" [(ngModel)]="brandSettings.footerText">
            </div>""",
    new_input
)
with open(gs_html, "w") as f:
    f.write(content)


# 3. Update login.component.ts
login_ts = "src/app/login/login.component.ts"
with open(login_ts, "r") as f:
    content = f.read()

if "SettingsService" not in content:
    content = content.replace(
        "import { Router } from '@angular/router';",
        "import { Router } from '@angular/router';\nimport { SettingsService } from '../settings.service';"
    )
    
    # Update constructor
    content = re.sub(
        r'constructor\(private authService: AuthService, private router: Router\) \{ \}',
        'constructor(private authService: AuthService, private router: Router, private settingsService: SettingsService) { }',
        content
    )
    
    # Add brandSettings and ngOnInit
    class_body_addition = """
  brandSettings: any = {
    appName: 'FleetTrack',
    footerText: '',
    loginBackgroundUrl: ''
  };

  ngOnInit() {
    this.settingsService.getBrandSettings().subscribe(data => {
      if (data) {
        this.brandSettings = data;
        if (this.brandSettings.loginBackgroundUrl) {
          document.documentElement.style.setProperty('--login-bg', `url(${this.brandSettings.loginBackgroundUrl})`);
        } else {
          document.documentElement.style.setProperty('--login-bg', 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217, 70, 239, 0.3), transparent 50%), radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.2), transparent 100%), #1e1b4b'); // Dark purple fallback
        }
      } else {
        document.documentElement.style.setProperty('--login-bg', 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217, 70, 239, 0.3), transparent 50%), radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.2), transparent 100%), #1e1b4b');
      }
    });
  }
"""
    content = content.replace("constructor(", class_body_addition + "\n  constructor(")
    
    # add implements OnInit
    content = content.replace("export class LoginComponent {", "import { OnInit } from '@angular/core';\n\nexport class LoginComponent implements OnInit {")

    with open(login_ts, "w") as f:
        f.write(content)

# 4. Update login.component.html
login_html = "src/app/login/login.component.html"
with open(login_html, "r") as f:
    content = f.read()

content = content.replace(
    'background: radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217, 70, 239, 0.3), transparent 50%), radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.2), transparent 100%), var(--secondary-color); backdrop-filter: blur(40px);',
    'background: var(--login-bg, radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217, 70, 239, 0.3), transparent 50%), radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.2), transparent 100%), #1e1b4b); background-size: cover; background-position: center; backdrop-filter: blur(40px); flex-direction: column;'
)

content = content.replace(
    '<h2 class="app-title" style="margin: 0; color: var(--text-main); font-size: 28px; font-weight: 600;">FleetTrack</h2>',
    '<h2 class="app-title" style="margin: 0; color: var(--text-main); font-size: 28px; font-weight: 600;">{{ brandSettings.appName || \'FleetTrack\' }}</h2>'
)

content = content.replace(
    '<h3 style="margin: 0 0 8px 0; font-size: 18px; color: var(--text-main); font-weight: 500;">Welcome to FleetTrack !</h3>',
    '<h3 style="margin: 0 0 8px 0; font-size: 18px; color: var(--text-main); font-weight: 500;">Welcome to {{ brandSettings.appName || \'FleetTrack\' }} !</h3>'
)

# Add footer
footer = """
  <!-- Footer -->
  <div *ngIf="brandSettings.footerText" style="margin-top: 40px; text-align: center; color: rgba(255,255,255,0.7); font-size: 13px; max-width: 600px;">
    {{ brandSettings.footerText }}
  </div>
"""

content = content.replace("  </mat-card>\n</div>", "  </mat-card>\n" + footer + "</div>")

with open(login_html, "w") as f:
    f.write(content)

print("Login page updated successfully.")
