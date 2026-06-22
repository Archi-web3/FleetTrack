import os
import re

def find_hardcoded_strings(dir_path):
    results = {}
    
    pattern = re.compile(r'>\s*([^<{}>]+)\s*<')
    
    ignored_words = {'settings', 'home', 'analytics', 'map', 'person', 'history', 'build', 
                     'event', 'assessment', 'power', 'close', 'edit', 'delete', 'check',
                     'add', 'remove', 'search', 'menu', 'info', 'warning', 'error',
                     'visibility', 'visibility_off', 'arrow_drop_down', 'arrow_drop_up',
                     'local_shipping', 'directions_car', 'tune', 'security', 'place', 'public'}
                     
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    matches = pattern.finditer(content)
                    for match in matches:
                        text = match.group(1).strip()
                        if not text:
                            continue
                            
                        if text.startswith('{{') and text.endswith('}}'):
                            continue
                        if ' ' not in text and text.islower() and ('_' in text or text in ignored_words):
                            continue
                        if text.isdigit() or re.match(r'^[0-9.,-]+$', text):
                            continue
                        if len(text) < 2 and not text.isalpha():
                            continue
                            
                        if file_path not in results:
                            results[file_path] = []
                        results[file_path].append(text)
                            
    return results

web_results = find_hardcoded_strings('/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src/app')

with open('/home/jonathan/Documents/App/ACF_vf/untranslated.txt', 'w', encoding='utf-8') as f:
    f.write(f"Web: found {sum(len(v) for v in web_results.values())} strings in {len(web_results)} files\n")
    for path, texts in web_results.items():
        f.write(f"\n{os.path.basename(path)}:\n")
        for text in texts:
            f.write(f"  - {text}\n")
