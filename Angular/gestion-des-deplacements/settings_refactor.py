import re

# 1. Update SettingsService
service_path = "src/app/settings.service.ts"
with open(service_path, "r") as f:
    service_code = f.read()

brand_methods = """
    // Brand Settings
    getBrandSettings(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/brandSettings`).pipe(
            map(setting => setting ? setting.value : null),
            catchError(err => {
                console.error('Erreur chargement Brand Settings', err);
                return of(null);
            })
        );
    }

    saveBrandSettings(settings: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/brandSettings`, { value: settings });
    }
"""

if "getBrandSettings" not in service_code:
    service_code = service_code.replace("getCO2Factors", brand_methods + "\n    // Récupérer les facteurs CO2\n    getCO2Factors")
    with open(service_path, "w") as f:
        f.write(service_code)

# 2. Update AppComponent
app_path = "src/app/app.component.ts"
with open(app_path, "r") as f:
    app_code = f.read()

if "SettingsService" not in app_code:
    app_code = app_code.replace("import { AuthService } from './auth.service';", "import { AuthService } from './auth.service';\nimport { SettingsService } from './settings.service';")
    
    constructor_match = re.search(r'constructor\((.*?)\) \{ \}', app_code)
    if constructor_match:
        old_args = constructor_match.group(1)
        app_code = app_code.replace(constructor_match.group(0), f'constructor({old_args}, private settingsService: SettingsService) {{ }}')
        
    init_logic = """
    this.settingsService.getBrandSettings().subscribe(settings => {
      if (settings && settings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      }
    });
"""
    app_code = app_code.replace("this.authService.isAuthenticated$.subscribe", init_logic + "\n    this.authService.isAuthenticated$.subscribe")
    
    with open(app_path, "w") as f:
        f.write(app_code)

print("SettingsService and AppComponent updated.")
