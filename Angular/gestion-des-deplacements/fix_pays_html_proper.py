file_path = 'src/app/gestion-pays/gestion-pays.component.html'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('[(ngModel)]="(selectedPays || newPays).nom"', '[(ngModel)]="newPays.nom"')
content = content.replace('[(ngModel)]="(selectedPays || newPays).code"', '[(ngModel)]="newPays.code"')
content = content.replace('[(ngModel)]="(selectedPays || newPays).devise"', '[(ngModel)]="newPays.devise"')

with open(file_path, 'w') as f:
    f.write(content)

print("Fixed ngModel.")
