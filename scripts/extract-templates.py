import PyPDF2
import json
import re
import os

def extract_tasks_from_pdf(pdf_path, template_type):
    """
    Extract maintenance tasks from PDF checklist.
    Returns a list of tasks with description and manual reference.
    """
    tasks = []
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract text from all pages
            full_text = ""
            for page in pdf_reader.pages:
                full_text += page.extract_text() + "\n"
            
            # Split into lines
            lines = full_text.split('\n')
            
            # Pattern to match task lines (adjust based on actual PDF format)
            # Looking for patterns like: "1. Task description ... Page 123"
            # or "Task description ............. 123"
            
            task_number = 1
            for i, line in enumerate(lines):
                line = line.strip()
                if not line:
                    continue
                
                # Try to extract task and page number
                # Pattern 1: "Description ... Page XX" or "Description ... XX"
                match = re.search(r'(.+?)\s*\.{2,}\s*(?:Page\s*)?(\d+)', line)
                if match:
                    description = match.group(1).strip()
                    page_num = match.group(2).strip()
                    
                    # Clean up description (remove leading numbers/bullets)
                    description = re.sub(r'^\d+[\.\)]\s*', '', description)
                    description = re.sub(r'^[•\-\*]\s*', '', description)
                    
                    if description and len(description) > 5:  # Avoid empty or too short
                        tasks.append({
                            'numero': str(task_number),
                            'description': description,
                            'numeroTacheManuel': page_num,
                            'categorie': categorize_task(description)
                        })
                        task_number += 1
            
            print(f"✅ Extracted {len(tasks)} tasks from {os.path.basename(pdf_path)}")
            
    except Exception as e:
        print(f"❌ Error reading {pdf_path}: {e}")
    
    return tasks

def categorize_task(description):
    """
    Automatically categorize a task based on keywords in description.
    """
    desc_lower = description.lower()
    
    if any(word in desc_lower for word in ['moteur', 'huile', 'filtre', 'vidange', 'courroie']):
        return 'Moteur'
    elif any(word in desc_lower for word in ['pneu', 'roue', 'frein', 'suspension']):
        return 'Roues/Pneus'
    elif any(word in desc_lower for word in ['batterie', 'électrique', 'fusible', 'câble']):
        return 'Batterie/Élec'
    elif any(word in desc_lower for word in ['éclairage', 'phare', 'feu', 'clignotant']):
        return 'Éclairage'
    elif any(word in desc_lower for word in ['sécurité', 'ceinture', 'extincteur', 'trousse']):
        return 'Sécurité/Documents'
    elif any(word in desc_lower for word in ['extérieur', 'carrosserie', 'pare-brise', 'vitre']):
        return 'Extérieur'
    elif any(word in desc_lower for word in ['intérieur', 'cabine', 'siège', 'tableau']):
        return 'Intérieur/Cabine'
    elif any(word in desc_lower for word in ['capot', 'radiateur', 'liquide']):
        return 'Sous le Capot'
    else:
        return 'Autre'

def create_template_json(template_name, template_type, tasks):
    """
    Create a template JSON object ready for MongoDB insertion.
    """
    return {
        'nom': template_name,
        'type': template_type,
        'typeVehicule': 'Land Cruiser',
        'actif': True,
        'taches': tasks
    }

def main():
    base_path = r"C:\Users\jonat\Documents\ACF\ACF_v2\Angular\e-logbook\public\assets\manuals"
    
    templates = [
        {
            'file': 'Check List hebdomadaire.pdf',
            'name': 'Checklist Hebdomadaire Standard',
            'type': 'Hebdomadaire'
        },
        {
            'file': 'Liste_Service_A.pdf',
            'name': 'Service A - Maintenance Légère',
            'type': 'Service A'
        },
        {
            'file': 'Liste_Service_B.pdf',
            'name': 'Service B - Maintenance Intermédiaire',
            'type': 'Service B'
        },
        {
            'file': 'Liste_Service_C.pdf',
            'name': 'Service C - Maintenance Complète',
            'type': 'Service C'
        }
    ]
    
    all_templates = []
    
    for tmpl in templates:
        pdf_path = os.path.join(base_path, tmpl['file'])
        if os.path.exists(pdf_path):
            print(f"\n📄 Processing: {tmpl['file']}")
            tasks = extract_tasks_from_pdf(pdf_path, tmpl['type'])
            
            if tasks:
                template_json = create_template_json(tmpl['name'], tmpl['type'], tasks)
                all_templates.append(template_json)
        else:
            print(f"⚠️  File not found: {pdf_path}")
    
    # Save to JSON file
    output_path = os.path.join(base_path, 'extracted_templates.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_templates, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Saved {len(all_templates)} templates to: {output_path}")
    print("\nNext steps:")
    print("1. Review the extracted_templates.json file")
    print("2. Use the backend API to import these templates")

if __name__ == '__main__':
    main()
