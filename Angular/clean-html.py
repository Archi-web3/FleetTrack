import re

# Lire le fichier HTML
with open('gestion-des-deplacements/src/app/consolidation-mouvements/consolidation-mouvements.component.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Nettoyer les caractères d'échappement
content = content.replace('\\u003c', '<')
content = content.replace('\\u003e', '>')
content = content.replace('\\"', '"')
content = content.replace('\\n', '')

# Écrire le fichier nettoyé
with open('gestion-des-deplacements/src/app/consolidation-mouvements/consolidation-mouvements.component.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML cleaned successfully")
