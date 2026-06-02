# Script PowerShell pour remplacer localhost:3000 par l'URL Render dans tous les services Angular

$files = Get-ChildItem -Path "C:\Users\jonat\Documents\ACF\ACF_v2\Angular\gestion-des-deplacements\src\app" -Filter "*.service.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace "http://localhost:3000/api", "https://fleettrack-api.onrender.com/api"
    Set-Content -Path $file.FullName -Value $newContent
    Write-Host "Updated: $($file.Name)"
}

Write-Host "`nDone! All service files updated."
