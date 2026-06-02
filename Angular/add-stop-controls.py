import codecs
import re

# Lire le fichier HTML
with codecs.open('gestion-des-deplacements/src/app/consolidation-mouvements/consolidation-mouvements.component.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Nettoyer les échappements d'abord
content = content.replace('\\u003c', '<')
content = content.replace('\\u003e', '>')
content = content.replace('\\"', '"')
content = content.replace('\\ud83d\\udccd', '📍')
content = content.replace('\\ud83d\\ude80', '🚀')
content = content.replace('\\ud83d\\udd04', '🔄')
content = content.replace('\\u00e9', 'é')

# Trouver et remplacer la section du lieu
old_lieu_section = '''<p style="margin: 8px 0; font-size: 0.95em;">
<strong>📍 Lieu :</strong> {{ stop.lieu.nom }}
<span style="color: #666;">({{ stop.lieu.adresse }})</span>
</p>'''

new_lieu_section = '''<!-- Sélecteur de lieu avec dropdown -->
<div style="margin: 12px 0;">
<label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">
📍 Lieu :
</label>
<select [(ngModel)]="stop.lieu._id" (change)="changeStopLocation(i, stop.lieu._id)"
style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9em;">
<option *ngFor="let lieu of lieux" [value]="lieu._id">
{{ lieu.nom }} ({{ lieu.adresse }})
</option>
</select>
</div>

<!-- Boutons de gestion -->
<div style="display: flex; gap: 8px; margin-top: 12px; margin-bottom: 12px;">
<button (click)="moveStopUp(i)" [disabled]="i === 0"
style="padding: 6px 12px; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 0.85em;"
[style.opacity]="i === 0 ? '0.5' : '1'">
⬆️ Monter
</button>
<button (click)="moveStopDown(i)" [disabled]="i === consolidationStops.length - 1"
style="padding: 6px 12px; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 0.85em;"
[style.opacity]="i === consolidationStops.length - 1 ? '0.5' : '1'">
⬇️ Descendre
</button>
<button (click)="removeStop(i)" [disabled]="consolidationStops.length <= 2"
style="padding: 6px 12px; background-color: #dc3545; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 0.85em;"
[style.opacity]="consolidationStops.length <= 2 ? '0.5' : '1'">
🗑️ Supprimer
</button>
</div>'''

content = content.replace(old_lieu_section, new_lieu_section)

# Écrire le fichier modifié
with codecs.open('gestion-des-deplacements/src/app/consolidation-mouvements/consolidation-mouvements.component.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML controls added and cleaned successfully")
