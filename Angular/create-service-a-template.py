import json

# Parse the Service A checklist data
service_a_tasks_raw = """
1	Fuites sous le véhicule
2	État des pneus : contrôle visuel (pression, craquelures/fissures, dégâts, usure normale, roues de secours)
BAT-	Véhicule équipé d'Airbag: Débrancher la Batterie! (En commençant par le câble négatif NOIR)
4	Niveau du liquide de refroidissement
6	Niveau du liquide de lave glace, contrôler le fonctionnement des gicleurs et des essuies glace
15	Nettoyer le filtre à air et le bol (remplacer si nécessaire)
8	Propreté du radiateur (principal et climatiseur), état/fixation de la moustiquaire
27	Changer le préfiltre à carburant
29	Contrôler les courroies ventilateur/alternateur et climatiseur
16	Contrôler la suspension: ressorts (état, alignements des lames de ressorts) silentbloc (ressorts arrière, barre stabilisatrice, levier principal), amortisseurs (fuites, fixation des bagues)
20	Graisser les arbres de transmission (6 graisseurs) et le système de direction (2 graisseurs)
33	Contrôler le jeu de tous les roulements de roue
35	Intervertir/alterner les roues (y compris roues de secours)
23	Nettoyer et lubrifier le cric Hi lift
19	Contrôler et nettoyer les reniflards (pont Av et Arr.)
BAT+	Véhicule équipé d'Airbag: Rebrancher la Batterie. (En commençant par le câble Positif ROUGE)
7	Fixation de la batterie, niveau d'eau, cosses
18	Contrôler le bon fonctionnement des portes, des serrures, des vitres et des ceintures de sécurité
9	Présence et inventaire des équipements de bord
10	Voyants lumineux du tableau de bord, éclairages intérieurs et extérieurs
11	Bruits anormaux du moteur (grincements et vibrations, ou bruits de moteur différents de la normale)
38	Contrôler le jeu au volant
12	Contrôle fonctionnel radio HF /VHF avec la base. Vérifiez si les antennes sont présentes, droites et non cassées.
13	Contrôle des câbles microphones HF / VHF
"""

def categorize_task(description):
    """Auto-categorize based on keywords"""
    desc_lower = description.lower()
    
    if any(word in desc_lower for word in ['moteur', 'huile', 'courroie', 'filtre', 'refroidissement', 'radiateur', 'carburant']):
        return 'Moteur'
    elif any(word in desc_lower for word in ['pneu', 'roue', 'suspension', 'frein', 'roulement', 'transmission', 'direction']):
        return 'Roues/Pneus'
    elif any(word in desc_lower for word in ['batterie', 'électrique', 'airbag']):
        return 'Batterie/Élec'
    elif any(word in desc_lower for word in ['éclairage', 'voyant', 'tableau de bord']):
        return 'Éclairage'
    elif any(word in desc_lower for word in ['porte', 'serrure', 'vitre', 'ceinture', 'équipement', 'inventaire']):
        return 'Sécurité/Documents'
    elif any(word in desc_lower for word in ['radio', 'hf', 'vhf', 'antenne', 'microphone']):
        return 'Communication'
    elif any(word in desc_lower for word in ['fuite', 'reniflard']):
        return 'Détection'
    elif any(word in desc_lower for word in ['lave', 'gicleur', 'essuie', 'nettoyer', 'lubrifier', 'cric']):
        return 'Nettoyage'
    else:
        return 'Autre'

# Parse tasks
tasks = []
for line in service_a_tasks_raw.strip().split('\n'):
    if not line.strip():
        continue
    
    parts = line.split('\t', 1)
    if len(parts) == 2:
        numero_tache = parts[0].strip()
        description = parts[1].strip()
        
        if description:  # Skip empty descriptions
            tasks.append({
                'numero': str(len(tasks) + 1),
                'numeroTacheManuel': numero_tache,
                'description': description,
                'categorie': categorize_task(description),
                'obligatoire': True
            })

# Create template object
template = {
    'nom': 'Service A - Maintenance Légère Land Cruiser',
    'type': 'Service A',
    'typeVehicule': 'Land Cruiser',
    'actif': True,
    'taches': tasks
}

print(f"✅ Parsed {len(tasks)} tasks for Service A")
print("\nTemplate preview:")
print(json.dumps(template, indent=2, ensure_ascii=False)[:500])
print("...\n")

# Save to file for review
with open('service_a_template.json', 'w', encoding='utf-8') as f:
    json.dump(template, f, indent=2, ensure_ascii=False)
print("✅ Saved to service_a_template.json")

# Post to API
API_URL = 'https://fleettrack-api.onrender.com/api/maintenance/template'

# You'll need to get the auth token from localStorage
print("\n⚠️  To create this template in the database:")
print("1. Get your auth token from the browser (localStorage.getItem('token'))")
print("2. Run this command:")
print(f"\ncurl -X POST {API_URL} \\")
print("  -H 'Content-Type: application/json' \\")
print("  -H 'x-auth-token: YOUR_TOKEN_HERE' \\")
print("  -d @service_a_template.json")
print("\nOr I can create a Node.js script to do this automatically if you provide the token.")
