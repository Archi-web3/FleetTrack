file_path = 'src/app/gestion-pays/gestion-pays.component.html'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('[(ngModel)]="selectedPays ? selectedPays.nom : newPays.nom"', '[(ngModel)]="(selectedPays || newPays).nom"')
content = content.replace('[(ngModel)]="selectedPays ? selectedPays.code : newPays.code"', '[(ngModel)]="(selectedPays || newPays).code"')
content = content.replace('[(ngModel)]="selectedPays ? selectedPays.devise : newPays.devise"', '[(ngModel)]="(selectedPays || newPays).devise"')

with open(file_path, 'w') as f:
    f.write(content)

print("Fixed ngModel ternary expressions.")
