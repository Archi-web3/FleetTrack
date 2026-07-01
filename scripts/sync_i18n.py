import json

def set_nested(d, key_path, value):
    keys = key_path.split('.')
    current = d
    for i, k in enumerate(keys[:-1]):
        if k not in current:
            current[k] = {}
        current = current[k]
    current[keys[-1]] = value

en_additions = {
    "MAINTENANCE.TABS.PREDICTIVE": "Predictive Maintenance",
    "MENU.DASHBOARD.FILTERS.ALL": "All",
    "MENU.DASHBOARD.FILTERS.SEARCH": "Search",
    "MENU.DASHBOARD.FILTERS.SEARCH_PLACEHOLDER": "Search...",
    "MENU.DASHBOARD.FILTERS.STATUS": "Status",
    "MENU.DASHBOARD.KPI.IN_PROGRESS": "In Progress",
    "MENU.DASHBOARD.KPI.PENDING": "Pending",
    "MENU.DASHBOARD.KPI.TOTAL": "Total",
    "MENU.DASHBOARD.KPI.VALIDATED": "Validated",
    "MENU.DASHBOARD.TABLE.DEPARTURE": "Departure",
    "MENU.DASHBOARD.TABLE.DRIVER": "Driver",
    "MENU.DASHBOARD.TABLE.NOT_ASSIGNED": "Not Assigned",
    "MENU.DASHBOARD.TABLE.OBJECTIVE": "Objective",
    "MENU.DASHBOARD.TABLE.REQUESTER": "Requester",
    "MENU.DASHBOARD.TABLE.STATUS": "Status",
    "MENU.DASHBOARD.TABLE.VEHICLE": "Vehicle",
    "MENU.GROUPS.ADMIN": "Administration",
    "MENU.GROUPS.DASHBOARD": "Dashboards",
    "MENU.GROUPS.FLEET": "Fleet Management",
    "MENU.GROUPS.MY_SPACE": "My Space",
    "MENU.GROUPS.OPERATIONS": "Operations",
    "MENU.GROUPS.SECURITY": "Security",
    "MENU.SECURITY_MATRIX": "Security Matrix",
    "USERS.FORM.AUTO_MANAGE_SECURITY": "Automatically manage security parameters based on locations",
    "VEHICLES.ACTIONS.UPDATE": "Update",
    "VEHICLES.STATUS.Hors Service": "Out of Service",
    "VEHICLES.STATUS.Inactif": "Inactive",
    "VEHICLES.STATUS.Restitué": "Returned",
    "VEHICLES.STATUS.Vendu": "Sold"
}

fr_additions = {
    "NEW_REQUEST_EXTRA.END": "Fin",
    "NEW_REQUEST_EXTRA.START": "Début",
    "VEHICLES.STATUS.Maintenance": "Maintenance",
    "VEHICLES.STATUS.Panne": "En Panne"
}

# Update EN
with open('Angular/gestion-des-deplacements/src/assets/i18n/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

for k, v in en_additions.items():
    set_nested(en, k, v)

with open('Angular/gestion-des-deplacements/src/assets/i18n/en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=4, ensure_ascii=False)

# Update FR
with open('Angular/gestion-des-deplacements/src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    fr = json.load(f)

for k, v in fr_additions.items():
    set_nested(fr, k, v)

with open('Angular/gestion-des-deplacements/src/assets/i18n/fr.json', 'w', encoding='utf-8') as f:
    json.dump(fr, f, indent=4, ensure_ascii=False)

print("Translation sync complete!")
