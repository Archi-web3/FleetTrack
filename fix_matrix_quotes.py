import os

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src/app/features/security-matrix'
files_to_check = [
    'security-matrix.component.html'
]

for f in files_to_check:
    path = os.path.join(base_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace("\\'", "'")
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Quotes fixed!")
