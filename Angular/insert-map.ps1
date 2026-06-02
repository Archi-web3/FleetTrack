$html = Get-Content 'gestion-des-deplacements\src\app\consolidation-mouvements\consolidation-mouvements.component.html' -Raw
$map = Get-Content 'gestion-des-deplacements\src\app\consolidation-mouvements\map-section-snippet.html' -Raw

# Chercher avant les boutons Annuler/Confirmer
$marker = '      <div style="margin-top: 25px; display: flex; gap: 12px; justify-content: flex-end;'
$index = $html.IndexOf($marker)

if ($index -gt 0) {
    $before = $html.Substring(0, $index)
    $after = $html.Substring($index)
    $newHtml = $before + $map + "`r`n`r`n" + $after
    
    Set-Content 'gestion-des-deplacements\src\app\consolidation-mouvements\consolidation-mouvements.component.html' -Value $newHtml -NoNewline
    Write-Host "Map section inserted successfully at position $index"
} else {
    Write-Host "Marker not found. Searching for alternative..."
    
    # Essayer un autre marqueur
    $marker2 = '      </div>'
    $lastIndex = $html.LastIndexOf($marker2, $html.IndexOf('</div>'))
    
    if ($lastIndex -gt 0) {
        Write-Host "Found alternative marker at $lastIndex"
    }
}
