file_path = 'src/app/gestion-lieux/gestion-lieux.component.html'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('attr.form="lieuForm"', 'form="lieuForm"')

with open(file_path, 'w') as f:
    f.write(content)
