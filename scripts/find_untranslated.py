import os
import re

def find_hardcoded_strings(dir_path):
    results = []
    
    # Matches text between > and < that contains letters, isn't just an angular binding, and doesn't look like an icon
    pattern = re.compile(r'>\s*([^{}<>]*[A-Za-z][^{}<>]*)\s*<')
    
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    matches = pattern.finditer(content)
                    for match in matches:
                        text = match.group(1).strip()
                        # Ignore common non-text or simple bindings
                        if text and not text.startswith('{{') and text not in ['mat-icon', 'expand_more', 'check', 'close', 'edit', 'delete']:
                            # Heuristic: if it's just a single material icon name, ignore
                            if ' ' not in text and text.islower() and '_' in text:
                                continue
                            results.append((file_path, text))
                            
    return results

web_results = find_hardcoded_strings('/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src/app')
mob_results = find_hardcoded_strings('/home/jonathan/Documents/App/ACF_vf/Angular/e-logbook/src/app')

print(f"Web: found {len(web_results)} potential hardcoded strings")
for path, text in web_results[:10]:
    print(f"  {os.path.basename(path)}: {text}")

print(f"Mobile: found {len(mob_results)} potential hardcoded strings")
for path, text in mob_results[:10]:
    print(f"  {os.path.basename(path)}: {text}")
