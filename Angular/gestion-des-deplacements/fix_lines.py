file_path = 'src/app/demande-mouvement/demande-mouvement.component.html'
with open(file_path, 'r') as f:
    lines = f.readlines()

def find_line(pattern):
    for i, line in enumerate(lines):
        if pattern in line:
            return i
    return -1

start_depart = find_line("<!-- Section Lieu de Départ -->")
start_etapes = find_line("<!-- Section Étapes Intermédiaires -->")
start_checkbox = find_line("<!-- Checkbox Lieu Retour Identique -->")
start_arrivee = find_line("<!-- Section Lieu d'Arrivée (SIMILAIRE AU DÉPART) -->")
start_passagers = find_line("<!-- NOUVEAU : Sélection multiple des passagers (MatSelect) -->")

if -1 in [start_depart, start_etapes, start_checkbox, start_arrivee, start_passagers]:
    print("Error: Could not find all sections.")
else:
    # Slices (exclusive of end index)
    # The end of a section is usually the line before the next section starts, minus empty lines
    depart_lines = lines[start_depart:start_etapes]
    etapes_lines = lines[start_etapes:start_checkbox]
    checkbox_lines = lines[start_checkbox:start_arrivee]
    arrivee_lines = lines[start_arrivee:start_passagers]

    new_content = lines[:start_depart]
    new_content.append('      <div class="modal-grid-2">\n')
    new_content.extend(depart_lines)
    new_content.extend(arrivee_lines)
    new_content.append('      </div>\n')
    new_content.extend(checkbox_lines)
    new_content.extend(etapes_lines)
    new_content.extend(lines[start_passagers:])

    with open(file_path, 'w') as f:
        f.writelines(new_content)
    print("Success: Rearranged by lines.")
