const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src/app');

// 1. Build a registry of all .ts files and their OLD and NEW absolute paths.
const fileRegistry = []; // { oldPath: string, newPath: string }

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const allTsFiles = walk(appDir);

// Deduce old paths based on new paths
allTsFiles.forEach(newPath => {
    let oldPath = newPath;
    const relativeToApp = path.relative(appDir, newPath);

    // If it's in core/services/
    if (relativeToApp.startsWith('core/services/')) {
        const basename = path.basename(newPath);
        if (basename === 'permissions.service.ts') {
            oldPath = path.join(appDir, 'services', basename);
        } else {
            oldPath = path.join(appDir, basename);
        }
    } 
    // If it's in core/interceptors/
    else if (relativeToApp.startsWith('core/interceptors/')) {
        const basename = path.basename(newPath);
        oldPath = path.join(appDir, 'interceptors', basename);
    }
    // If it's in shared/components/
    else if (relativeToApp.startsWith('shared/components/')) {
        // e.g. shared/components/language-selector/language-selector.component.ts
        const subPath = relativeToApp.replace('shared/components/', '');
        oldPath = path.join(appDir, subPath);
    }
    // If it's in features/
    else if (relativeToApp.startsWith('features/')) {
        const subPath = relativeToApp.replace('features/', '');
        // Some were already in features/ (like audit-log, map, security-alerts, statistics, waiver-list)
        const alreadyInFeatures = ['audit-log', 'map', 'security-alerts', 'statistics', 'waiver-list'];
        const featureName = subPath.split('/')[0];
        if (alreadyInFeatures.includes(featureName)) {
            oldPath = newPath; // Didn't move
        } else {
            oldPath = path.join(appDir, subPath);
        }
    }

    fileRegistry.push({ oldPath, newPath });
});

console.log(`Registry built with ${fileRegistry.length} files.`);

// 2. Iterate through all files and fix their imports
let fixedCount = 0;

allTsFiles.forEach(currentNewPath => {
    const currentFileOldPath = fileRegistry.find(f => f.newPath === currentNewPath).oldPath;
    const oldDir = path.dirname(currentFileOldPath);
    const newDir = path.dirname(currentNewPath);

    let content = fs.readFileSync(currentNewPath, 'utf-8');
    let hasChanges = false;

    // Regex to match imports: import { ... } from './path'; or import ... from "../path"; or loadComponent: () => import('./path')
    const importRegex = /from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    const newContent = content.replace(importRegex, (match, fromGroup, importGroup) => {
        const importStr = fromGroup || importGroup;
        
        // Only process relative imports
        if (!importStr.startsWith('.')) return match;

        // Calculate absolute old path of the imported file
        const importedOldAbsPathPrefix = path.resolve(oldDir, importStr);
        
        // Find this imported file in the registry (try to match ignoring extension)
        const importedFileRecord = fileRegistry.find(f => {
            // It could be importing a directory (index.ts) or file without extension
            const withoutExt = f.oldPath.replace(/\.ts$/, '');
            return withoutExt === importedOldAbsPathPrefix || f.oldPath === importedOldAbsPathPrefix;
        });

        if (importedFileRecord) {
            // Calculate new relative path
            let newRelativePath = path.relative(newDir, importedFileRecord.newPath);
            
            // Remove .ts extension if it was added
            newRelativePath = newRelativePath.replace(/\.ts$/, '');
            
            // Ensure it starts with ./ or ../
            if (!newRelativePath.startsWith('.')) {
                newRelativePath = './' + newRelativePath;
            }

            // Replace in original match
            if (fromGroup) {
                hasChanges = true;
                return `from '${newRelativePath}'`;
            } else if (importGroup) {
                hasChanges = true;
                return `import('${newRelativePath}')`;
            }
        }

        return match;
    });

    if (hasChanges) {
        fs.writeFileSync(currentNewPath, newContent);
        fixedCount++;
    }
});

console.log(`Fixed imports in ${fixedCount} files.`);
