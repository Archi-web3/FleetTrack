import re

file_path = 'src/app/gestion-vehicules/gestion-vehicules.component.html'
with open(file_path, 'r') as f:
    content = f.read()

# Marque & Modele
content = content.replace(
    '<div style="margin-bottom: 10px;">\n        <label for="newVehiculeMarque">',
    '<div class="modal-grid-2">\n      <div style="margin-bottom: 10px;">\n        <label for="newVehiculeMarque">'
)
content = content.replace(
    'style="width: 100%; padding: 8px;">\n      </div>\n      <div style="margin-bottom: 10px;">\n        <label for="newVehiculeImmatriculation">',
    'style="width: 100%; padding: 8px;">\n      </div>\n      </div>\n      <div class="modal-grid-2">\n      <div style="margin-bottom: 10px;">\n        <label for="newVehiculeImmatriculation">'
)
content = content.replace(
    'style="width: 100%; padding: 8px; background-color: #e9ecef;"\n          [placeholder]="\'VEHICLES.FORM.ACF_CODE_HINT\' | translate" readonly disabled>\n      </div>',
    'style="width: 100%; padding: 8px; background-color: #e9ecef;"\n          [placeholder]="\'VEHICLES.FORM.ACF_CODE_HINT\' | translate" readonly disabled>\n      </div>\n      </div>'
)

with open(file_path, 'w') as f:
    f.write(content)
print("done")
