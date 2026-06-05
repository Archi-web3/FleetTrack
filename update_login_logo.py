html_path = "Angular/gestion-des-deplacements/src/app/login/login.component.html"
with open(html_path, "r") as f:
    html_code = f.read()

html_code = html_code.replace(
    '<img src="assets/logo_acf.png" alt="Logo" style="max-width: 60px; height: auto;">',
    '<img [src]="brandSettings.logoDark || \'assets/logo_acf.png\'" alt="Logo" style="max-height: 60px; max-width: 150px; width: auto; object-fit: contain;">'
)

with open(html_path, "w") as f:
    f.write(html_code)

print("Login logo updated.")
