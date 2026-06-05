# Update app.component.ts to expose brandSettings
ts_path = "Angular/gestion-des-deplacements/src/app/app.component.ts"
with open(ts_path, "r") as f:
    ts_code = f.read()

if "brandSettings: any = {};" not in ts_code:
    ts_code = ts_code.replace(
        "userName: string | null = null;",
        "userName: string | null = null;\n  brandSettings: any = {};"
    )
    
    init_logic = """
    this.settingsService.getBrandSettings().subscribe(settings => {
      if (settings) {
        this.brandSettings = settings;
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
      }
    });
"""
    # Replace old init logic
    ts_code = ts_code.replace("""    this.settingsService.getBrandSettings().subscribe(settings => {
      if (settings && settings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      }
    });""", init_logic)
    
    with open(ts_path, "w") as f:
        f.write(ts_code)

# Update app.component.html to use the logo and title
html_path = "Angular/gestion-des-deplacements/src/app/app.component.html"
with open(html_path, "r") as f:
    html_code = f.read()

html_code = html_code.replace(
    '<img src="assets/logo_acf.png" alt="Logo" style="filter: brightness(0) invert(1);">',
    '<img [src]="brandSettings?.logoLight || \'assets/logo_acf.png\'" alt="Logo" style="max-height: 40px; width: auto; object-fit: contain;">'
)

html_code = html_code.replace(
    '<h1>FleetTrack</h1>',
    '<h1>{{ brandSettings?.appName || \'FleetTrack\' }}</h1>'
)

with open(html_path, "w") as f:
    f.write(html_code)

print("AppComponent updated to use brandSettings logos and title.")
