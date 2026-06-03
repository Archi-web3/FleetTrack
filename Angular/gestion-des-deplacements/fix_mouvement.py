import re

file_path = 'src/app/demande-mouvement/demande-mouvement.component.html'
with open(file_path, 'r') as f:
    content = f.read()

# Extract the four blocks:
# 1. Depart
depart_match = re.search(r'(<!-- Section Lieu de Départ -->\s*<div style="margin-bottom: 15px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">.*?</div>\s*</div>)', content, re.DOTALL)
# 2. Etapes
etapes_match = re.search(r'(<!-- Section Étapes Intermédiaires -->.*?</div>\s*</div>)', content, re.DOTALL)
# 3. Checkbox
checkbox_match = re.search(r'(<!-- Checkbox Lieu Retour Identique -->.*?</div>)', content, re.DOTALL)
# 4. Arrivee
arrivee_match = re.search(r'(<!-- Section Lieu d\'Arrivée \(SIMILAIRE AU DÉPART\) -->\s*<div style="margin-bottom: 15px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">.*?</div>\s*</div>)', content, re.DOTALL)

if depart_match and etapes_match and checkbox_match and arrivee_match:
    depart_str = depart_match.group(1)
    etapes_str = etapes_match.group(1)
    checkbox_str = checkbox_match.group(1)
    arrivee_str = arrivee_match.group(1)
    
    # Remove them from content
    content = content.replace(depart_str, '')
    content = content.replace(etapes_str, '')
    content = content.replace(checkbox_str, '')
    content = content.replace(arrivee_str, '')
    
    # Construct the new block
    new_block = f"""
      <div class="modal-grid-2">
{depart_str}
{arrivee_str}
      </div>
{checkbox_str}
{etapes_str}
"""
    
    # Insert back where Depart used to be (after Mode de Transport)
    # Mode de Transport ends with: </select>\n      </div>
    mode_end = "<!-- Section Mode de Transport (DÉPLACÉ EN HAUT) -->\n      <div\n        style=\"margin-bottom: 15px; padding: 10px; background-color: #e3f2fd; border-radius: 5px; border-left: 5px solid #2196F3;\">\n        <label for=\"modeTransport\" style=\"font-weight: bold; color: #0d47a1;\">{{ 'NEW_REQUEST.MISSION.TRANSPORT_MODE' |\n          translate }}</label>\n        <select id=\"modeTransport\" name=\"modeTransport\" [(ngModel)]=\"mouvement.modeTransport\" required\n          style=\"width: 100%; padding: 8px; margin-top: 5px;\">\n          <option *ngFor=\"let mode of transportModes\" [value]=\"mode\">{{ 'TRANSPORT_MODES.' +\n            mode.toUpperCase().replace('É', 'E') | translate }}</option>\n        </select>\n      </div>\n"
    
    if mode_end in content:
        content = content.replace(mode_end, mode_end + new_block)
        with open(file_path, 'w') as f:
            f.write(content)
        print("Success: Rearranged HTML blocks.")
    else:
        print("Error: Could not find mode_end insertion point.")
else:
    print("Error: Could not match one or more blocks.")
